import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/products";
import { useCart } from "../context/CartContext";
import ProductReviews from "../components/ProductReviews";

const UPLOAD_FILE_BASE = "https://api.react.nos-apps.com/api/upload/file";
const STATIC_IMAGES = {
  5: "/image/sony.jpeg",
  6: "/image/ipad.jpeg",
  7: "/image/nintendo.jpeg",
  8: "/image/logitech.jpeg",
  1: "/image/pc.jpeg",
  2: "/image/iphone.jpeg",
  3: "/image/watch.jpeg",
  4: "/image/macbook.jpeg",
};

export default function ProductDetails() {
  const { id } = useParams();
  const { add } = useCart(); // hook pour ajouter au panier
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // imageUrl résolue (peut être URL publique ou objectURL créé depuis un blob)
  const [imageUrl, setImageUrl] = useState(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        if (!id) {
          setError("ID du produit manquant");
          return;
        }

        const data = await getProductById(id);
        // normaliser selon la forme renvoyée par getProductById
        // certains helper renvoient { data: {...} } ou l'objet directement
        const productData = data?.data ?? data;
        if (!productData || Object.keys(productData).length === 0) {
          setError("Produit introuvable");
        } else {
          setProduct(productData);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Erreur lors de la récupération du produit");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
    // cleanup prev objectURL si existant
    return () => {
      if (objectUrlRef.current) {
        try { URL.revokeObjectURL(objectUrlRef.current); } catch {}
        objectUrlRef.current = null;
      }
    };
  }, [id]);

  // Résoudre l'URL de l'image une fois le product chargé
  useEffect(() => {
    if (!product) {
      setImageUrl(null);
      return;
    }

    let mounted = true;

    async function resolveImage() {
      // cleanup ancien objectURL
      if (objectUrlRef.current) {
        try { URL.revokeObjectURL(objectUrlRef.current); } catch {}
        objectUrlRef.current = null;
      }

      // champs possibles contenant l'image
      const candidates = [
        product.imageUrl,
        product.image_url,
        product.image,
        product.image_uuid,
        product.file_uuid,
        product.file,
      ].filter(Boolean);

      // helper fallback static selon id
      const staticFallback = STATIC_IMAGES[product.id] || "/image/no-image.png";

      if (candidates.length === 0) {
        if (mounted) setImageUrl(staticFallback);
        return;
      }

      // prendre le premier candidat valable
      let candidate = candidates[0];

      // Si candidate est un objet (ex: {url: "..."}), récupérer url
      if (typeof candidate === "object") {
        candidate = candidate.url || candidate.path || candidate.name || "";
      }

      // Si c'est déjà une URL complète, l'utiliser directement
      if (typeof candidate === "string" && (candidate.startsWith("http://") || candidate.startsWith("https://"))) {
        if (mounted) setImageUrl(candidate);
        return;
      }

      // Si candidate ressemble à un chemin relatif commençant par /api/
      if (typeof candidate === "string" && candidate.startsWith("/api")) {
        const fullUrl = candidate.startsWith("http") ? candidate : `${window.location.origin}${candidate}`;
        try {
          const token = localStorage.getItem("token");
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          const res = await fetch(fullUrl, { method: "GET", headers });
          if (res.ok) {
            const ct = res.headers.get("content-type") || "";
            if (ct.includes("image/")) {
              const blob = await res.blob();
              const obj = URL.createObjectURL(blob);
              objectUrlRef.current = obj;
              if (mounted) setImageUrl(obj);
              return;
            }
            // si le endpoint renvoie JSON (métadonnées), essayer d'extraire url
            if (ct.includes("application/json")) {
              const json = await res.json().catch(() => null);
              const urlFromJson = json?.url || json?.data?.url || json?.file?.url;
              if (urlFromJson) {
                if (mounted) setImageUrl(urlFromJson);
                return;
              }
            }
          } else {
            console.warn("fetch image api returned", res.status, fullUrl);
          }
        } catch (err) {
          console.warn("Erreur fetching image from API path:", err);
        }
        // si tout échoue, fallback à l'image statique
        if (mounted) setImageUrl(staticFallback);
        return;
      }

      // Si candidate ressemble à un uuid ou un nom de fichier, construire l'URL d'upload fournie par le prof
      // ex: https://api.react.nos-apps.com/api/upload/file/{uuid}
      if (typeof candidate === "string") {
        const fileUrl = `${UPLOAD_FILE_BASE}/${candidate}`;
        try {
          const token = localStorage.getItem("token");
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          const res = await fetch(fileUrl, { method: "GET", headers });
          if (res.ok) {
            const ct = res.headers.get("content-type") || "";
            if (ct.includes("image/")) {
              const blob = await res.blob();
              const obj = URL.createObjectURL(blob);
              objectUrlRef.current = obj;
              if (mounted) setImageUrl(obj);
              return;
            }
            // si JSON avec url
            if (ct.includes("application/json")) {
              const json = await res.json().catch(() => null);
              const urlFromJson = json?.url || json?.data?.url || json?.file?.url;
              if (urlFromJson) {
                if (mounted) setImageUrl(urlFromJson);
                return;
              }
            }
          } else {
            console.warn("fetch upload file returned", res.status, fileUrl);
          }
        } catch (err) {
          console.warn("Erreur fetching upload/file:", err);
        }
        // fallback statique
        if (mounted) setImageUrl(staticFallback);
        return;
      }

      // Par défaut fallback
      if (mounted) setImageUrl(staticFallback);
    }

    resolveImage();

    return () => {
      mounted = false;
    };
  }, [product]);

  async function handleAddToCart() {
    if (!product?.id) return;

    setAdding(true);
    setMessage("");
    setIsError(false);

    try {
      await add(product.id, 1); // utilisation du hook CartContext
      setMessage("Produit ajouté au panier avec succès !");
      setIsError(false);
    } catch (err) {
      console.error(err);
      setMessage("Impossible d'ajouter le produit au panier.");
      setIsError(true);
    } finally {
      setAdding(false);
    }
  }

  if (loading)
    return (
      <p className="text-center mt-20 text-xl font-semibold text-gray-600">
        Chargement...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-20 text-red-500 text-lg font-semibold">
        {error}
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      {/* Détails produit */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 bg-white rounded-2xl shadow p-6">
        <img
          src={imageUrl || "/image/no-image.png"}
          alt={product.name}
          className="rounded-2xl w-full h-auto object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = STATIC_IMAGES[product.id] || "/image/no-image.png";
          }}
        />

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-emerald-600 text-2xl mt-4">
            {product.price ? `${product.price?.toLocaleString()} FCFA` : "Prix indisponible"}
          </p>
          <p className="text-gray-700 mt-6">
            {product.description || "Aucune description disponible"}
          </p>

          <button
            className={`mt-8 px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition ${
              adding ? "opacity-70 cursor-not-allowed" : ""
            }`}
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? "Ajout en cours..." : "Ajouter au panier"}
          </button>

          {message && (
            <p className={`mt-4 text-sm font-medium ${isError ? "text-red-500" : "text-green-600"}`}>
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Avis produit */}
      {product?.id && <ProductReviews productId={product.id} />}
    </div>
  );
}