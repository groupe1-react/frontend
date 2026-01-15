import React, { useEffect, useState, useRef } from "react";
import { getProducts } from "../api/products";
import { createProduct, updateProduct, deleteProduct, uploadImage } from "../api/admin";

const API_BASE = "https://api.react.nos-apps.com"; // base remote API (sans /groupe-1 pour upload endpoints)
const UPLOAD_FILE_BASE = `${API_BASE}/api/upload/file`;
const STATIC_PLACEHOLDER = "/image/no-image.png";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState(null);

  const emptyForm = { id: null, name: "", price: "", description: "", imageFile: null, imagePreview: "", imageUrl: "" };
  const [form, setForm] = useState(emptyForm);

  // store object URLs created from blobs so we can revoke them on unmount/update
  const objectUrlsRef = useRef([]);

  useEffect(() => {
    fetchProducts();
    return () => {
      // cleanup created object URLs
      objectUrlsRef.current.forEach((u) => {
        try { URL.revokeObjectURL(u); } catch (e) {}
      });
      objectUrlsRef.current = [];
    };
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setError("");
    try {
      const res = await getProducts();
      const list = Array.isArray(res?.data) ? res.data : res?.data ?? res ?? [];
      // attach placeholder for imageDisplay; will resolve real URLs asynchronously
      const initialized = list.map((p) => ({ ...p, imageDisplay: STATIC_PLACEHOLDER }));
      setProducts(initialized);
      // resolve images after we set products
      resolveImages(initialized);
    } catch (err) {
      console.error(err);
      setError(err.message || "Impossible de charger les produits");
    } finally {
      setLoading(false);
    }
  }

  // Try to resolve image for each product:
  // - if product has an absolute URL -> use it
  // - if product has a relative '/api/...' or a uuid/name -> try fetch to the remote API (UPLOAD_FILE_BASE/{candidate}) with token and create objectURL from blob
  // - otherwise fallback to static placeholder
  async function resolveImages(productList) {
    // revoke previous object URLs
    objectUrlsRef.current.forEach((u) => {
      try { URL.revokeObjectURL(u); } catch (e) {}
    });
    objectUrlsRef.current = [];

    const token = localStorage.getItem("token");

    const resolved = await Promise.all(
      productList.map(async (p) => {
        const candidates = [
          p.image_url,
          p.imageUrl,
          p.image,
          p.file_uuid,
          p.image_uuid,
          p.file,
        ].filter(Boolean);

        // fallback static if no candidate
        const staticFallback = p.image_url || p.imageUrl || STATIC_PLACEHOLDER;

        if (candidates.length === 0) {
          return { ...p, imageDisplay: staticFallback };
        }

        // take first candidate
        let candidate = candidates[0];
        if (typeof candidate === "object") {
          candidate = candidate.url || candidate.path || candidate.name || "";
        }
        if (!candidate || typeof candidate !== "string") {
          return { ...p, imageDisplay: staticFallback };
        }

        // If absolute URL, use it directly
        if (candidate.startsWith("http://") || candidate.startsWith("https://")) {
          return { ...p, imageDisplay: candidate };
        }

        // If candidate looks like an API path starting with /api, build URL to remote API (not to localhost dev server)
        if (candidate.startsWith("/api")) {
          const fullUrl = `${API_BASE}${candidate}`;
          try {
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await fetch(fullUrl, { method: "GET", headers });
            if (res.ok) {
              const ct = res.headers.get("content-type") || "";
              if (ct.startsWith("image/")) {
                const blob = await res.blob();
                const obj = URL.createObjectURL(blob);
                objectUrlsRef.current.push(obj);
                return { ...p, imageDisplay: obj };
              } else if (ct.includes("application/json")) {
                const json = await res.json().catch(() => null);
                const urlFromJson = json?.url || json?.data?.url || json?.file?.url;
                if (urlFromJson) return { ...p, imageDisplay: urlFromJson };
              }
            } else {
              console.warn("Failed to fetch image api path", fullUrl, res.status);
            }
          } catch (e) {
            console.warn("Error fetching image api path", e);
          }
          return { ...p, imageDisplay: staticFallback };
        }

        // Otherwise assume candidate is a uuid or filename -> try upload file endpoint on remote API
        try {
          const fileUrl = `${UPLOAD_FILE_BASE}/${candidate}`;
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          const res = await fetch(fileUrl, { method: "GET", headers });
          if (res.ok) {
            const ct = res.headers.get("content-type") || "";
            if (ct.startsWith("image/")) {
              const blob = await res.blob();
              const obj = URL.createObjectURL(blob);
              objectUrlsRef.current.push(obj);
              return { ...p, imageDisplay: obj };
            } else if (ct.includes("application/json")) {
              const json = await res.json().catch(() => null);
              const urlFromJson = json?.url || json?.data?.url || json?.file?.url;
              if (urlFromJson) return { ...p, imageDisplay: urlFromJson };
            }
          } else {
            console.warn("upload/file fetch returned", res.status, fileUrl);
          }
        } catch (e) {
          console.warn("Error fetching upload/file for", candidate, e);
        }

        // final fallback
        return { ...p, imageDisplay: staticFallback };
      })
    );

    setProducts(resolved);
  }

  function openCreate() {
    setForm(emptyForm);
    setFormErrors(null);
    setFormOpen(true);
  }

  function openEdit(product) {
    setForm({
      id: product.id,
      name: product.name || "",
      price: product.price ?? "",
      description: product.description || "",
      imageFile: null,
      imagePreview: product.image_url || product.imageUrl || product.image || "",
      imageUrl: product.image_url || product.imageUrl || "",
    });
    setFormErrors(null);
    setFormOpen(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) {
      // revoke previous preview if any
      if (form.imagePreview && typeof form.imagePreview === "string" && form.imagePreview.startsWith("blob:")) {
        try { URL.revokeObjectURL(form.imagePreview); } catch {}
      }
      setForm((f) => ({ ...f, imageFile: null, imagePreview: "" }));
      return;
    }
    // revoke previous preview (avoid leak)
    if (form.imagePreview && typeof form.imagePreview === "string" && form.imagePreview.startsWith("blob:")) {
      try { URL.revokeObjectURL(form.imagePreview); } catch {}
    }
    const preview = URL.createObjectURL(file);
    setForm((f) => ({ ...f, imageFile: file, imagePreview: preview }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormErrors(null);

    if (!form.name.trim()) {
      setFormErrors("Le nom du produit est requis.");
      return;
    }
    if (!form.price || Number.isNaN(Number(form.price))) {
      setFormErrors("Le prix est invalide.");
      return;
    }

    setSaving(true);
    try {
      let payload = {
        name: form.name.trim(),
        price: Number(form.price),
        description: form.description || "",
      };

      // If a file is selected, upload it first
      if (form.imageFile) {
        const up = await uploadImage(form.imageFile);
        const uuid = up?.uuid || up?.data?.uuid || up?.id || up?.data?.id || up?.file?.uuid || up?.file?.id || null;
        const url = up?.url || up?.data?.url || up?.file?.url || null;
        if (uuid) payload.image_uuid = uuid;
        else if (url) payload.image_url = url;
      } else if (form.imageUrl) {
        payload.image_url = form.imageUrl;
      }

      if (form.id) {
        await updateProduct(form.id, payload);
      } else {
        await createProduct(payload);
      }

      await fetchProducts();
      setFormOpen(false);
    } catch (err) {
      console.error("admin save error:", err);
      const body = err?.body;
      if (body?.errors) {
        const messages = Object.values(body.errors).flat().join(", ");
        setFormErrors(messages);
      } else {
        setFormErrors(err.message || "Erreur lors de l'enregistrement");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Confirmer la suppression de ce produit ?")) return;
    try {
      await deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer le produit: " + (err?.message || "Erreur"));
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admin - Gestion des produits</h1>
        <div>
          <button onClick={openCreate} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Créer un produit
          </button>
        </div>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="space-y-4">
          {products.length === 0 && <p>Aucun produit.</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded shadow p-4 flex flex-col">
                <div className="h-40 bg-gray-100 rounded overflow-hidden flex items-center justify-center mb-3">
                  <img
                    src={p.imageDisplay || STATIC_PLACEHOLDER}
                    alt={p.name}
                    className="object-cover w-full h-full"
                    onError={(e) => { e.target.onerror = null; e.target.src = STATIC_PLACEHOLDER; }}
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-gray-500">{p.price ? `${p.price.toLocaleString()} FCFA` : "Prix non renseigné"}</p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button onClick={() => openEdit(p)} className="px-3 py-1 bg-amber-500 text-white rounded">Modifier</button>
                  <button onClick={() => handleDelete(p.id)} className="px-3 py-1 bg-red-600 text-white rounded">Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form modal / panel */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center p-6 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">{form.id ? "Modifier le produit" : "Créer un produit"}</h2>
              <button onClick={() => setFormOpen(false)} className="text-gray-500 hover:text-gray-700">Fermer</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formErrors && <div className="text-red-600 text-sm">{formErrors}</div>}

              <div>
                <label className="block text-sm text-gray-600 mb-1">Nom</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Prix (FCFA)</label>
                <input name="price" value={form.price} onChange={handleChange} type="number" className="w-full border rounded px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full border rounded px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Image (upload)</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {form.imagePreview && (
                  <img src={form.imagePreview} alt="preview" className="mt-2 w-40 h-40 object-cover rounded" />
                )}
                <div className="mt-2 text-sm text-gray-500">Ou coller une URL publique :</div>
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." className="w-full border rounded px-3 py-2 mt-1" />
              </div>

              <div className="flex items-center gap-3">
                <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                  {saving ? "Enregistrement..." : form.id ? "Mettre à jour" : "Créer"}
                </button>
                <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 border rounded">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}