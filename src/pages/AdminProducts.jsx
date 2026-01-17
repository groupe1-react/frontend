import React, { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import { createProduct, updateProduct, deleteProduct } from "../api/admin"; // On n'importe plus uploadImage
import noImage from "/no-image.png";

const API_BASE = "https://api.react.nos-apps.com";

function isAbsoluteUrl(s) {
  return typeof s === "string" && (s.startsWith("http://") || s.startsWith("https://"));
}
function looksLikeUuidOrFilename(s) {
  return typeof s === "string" && s.length > 0 && !s.includes("/") && !s.startsWith("http");
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState(null);

  const emptyForm = { 
    id: null, 
    name: "", 
    price: "", 
    stock: 0, 
    description: "", 
    imageFile: null, 
    imagePreview: "", 
    imageUrl: "", 
    groupe: "groupe-1"
  };
  
  const [form, setForm] = useState(emptyForm);

  const ITEMS_PER_PAGE = 3;
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setError("");
    try {
      const res = await getProducts();
      let list = res?.data || (Array.isArray(res) ? res : []);
      
      // TRI CROISSANT : Les nouveaux produits s'ajoutent à la fin de la liste
      list.sort((a, b) => (a.id || 0) - (b.id || 0));
      
      setProducts(list);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les produits");
    } finally {
      setLoading(false);
    }    
  }

  function computeImageSrc(p) {
    if (!p) return noImage;
    let val = p.image || p.image_url || p.imageUrl;
    if (!val) return noImage;
    if (typeof val === "string" && val.includes("source.unsplash.com")) {
      return val.replace("source.unsplash.com", "images.unsplash.com");
    }
    if (isAbsoluteUrl(val)) return val;
    if (looksLikeUuidOrFilename(val)) {
      return `${API_BASE}/api/upload/file/${val}`;
    }
    return noImage;
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
      stock: product.stock ?? 0,
      description: product.description || "",
      imageFile: null,
      imagePreview: computeImageSrc(product),
      imageUrl: product.image || "", 
      groupe: product.groupe || "groupe-1",
    });
    setFormErrors(null);
    setFormOpen(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) {
      setForm((f) => ({ ...f, imageFile: null, imagePreview: "" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, imageFile: file, imagePreview: reader.result || "" }));
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormErrors(null);

    if (!form.name.trim()) { setFormErrors("Le nom est requis."); return; }
    if (!form.price) { setFormErrors("Le prix est requis."); return; }

    setSaving(true);
    try {
      // Préparation du payload sans upload physique
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description || "",
        groupe: "groupe-1",
        image: form.imageFile ? "hardware.jpeg" : (form.imageUrl || "hardware.jpeg")
      };

      if (form.id) {
        await updateProduct(form.id, payload);
      } else {
        await createProduct(payload);
      }

      await fetchProducts();
      setFormOpen(false);
      setForm(emptyForm);
    } catch (err) {
      console.error("Erreur save:", err);
      setFormErrors(err.body?.message || "Le serveur refuse l'enregistrement (Erreur 500).");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Confirmer la suppression ?")) return;
    try {
      await deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      alert("Impossible de supprimer");
    }
  }

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  const displayed = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admin - Gestion des produits</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
          Créer un produit
        </button>
      </div>

      {loading ? <p className="text-center py-10">Chargement des produits...</p> : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayed.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm p-4 flex flex-col border border-gray-100">
                <div className="h-40 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center mb-3">
                  <img src={computeImageSrc(p)} alt={p.name} className="object-cover w-full h-full" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  <p className="text-sm text-indigo-600 font-bold">{p.price?.toLocaleString()} FCFA</p>
                  <p className="text-[10px] text-gray-400 mt-2 italic">ID: {p.id} | Stock: {p.stock} | {p.groupe}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => openEdit(p)} className="flex-1 px-3 py-2 bg-amber-500 text-white rounded-lg text-xs font-medium">Modifier</button>
                  <button onClick={() => handleDelete(p.id)} className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-medium">Supprimer</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center items-center gap-3">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 border rounded-lg disabled:opacity-30">Préc.</button>
            <div className="text-sm font-medium">Page {page} sur {totalPages}</div>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 border rounded-lg disabled:opacity-30">Suiv.</button>
          </div>
        </>
      )}

      {formOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">{form.id ? "Modifier le produit" : "Nouveau produit"}</h2>
            
            {formErrors && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-xs font-medium">
                {formErrors}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom du produit</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border-gray-200 border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prix (FCFA)</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border-gray-200 border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock</label>
                  <input type="number" name="stock" value={form.stock} onChange={handleChange} className="w-full border-gray-200 border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="w-full border-gray-200 border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" rows="3" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                {form.imagePreview && <img src={form.imagePreview} className="mt-3 h-28 w-full object-cover rounded-xl border border-gray-100" alt="Aperçu" />}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-600">Annuler</button>
                <button type="submit" disabled={saving} className="px-6 py-2 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition">
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
