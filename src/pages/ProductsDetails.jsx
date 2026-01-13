// src/pages/ProductDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/products";
import { useCart } from "../context/CartContext";
import ProductReviews from "../components/ProductReviews";

export default function ProductDetails() {
  const { id } = useParams();
  const { add } = useCart(); // hook pour ajouter au panier
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        if (!id) {
          setError("ID du produit manquant");
          return;
        }

        const data = await getProductById(id);
        if (!data || Object.keys(data).length === 0) {
          setError("Produit introuvable");
        } else {
          const imageUrl = data.image || data.imageUrl || "/no-image.png";
          setProduct({ ...data, imageUrl });
        }
      } catch (err) {
        setError(err.message || "Erreur lors de la récupération du produit");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

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
          src={product.imageUrl}
          alt={product.name}
          className="rounded-2xl w-full h-auto object-cover"
          onError={(e) => {
            e.target.onerror = null;
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
      <ProductReviews productId={product.id} />
    </div>
  );
}
