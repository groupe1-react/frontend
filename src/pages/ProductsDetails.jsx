import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/products";
import { apiFetch } from "../api/apiFetch"; // pour utiliser l'API

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false); // pour état ajout panier
  const [message, setMessage] = useState("");  // message succès/erreur

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
          setProduct(data);
        }
      } catch (err) {
        setError(err.message || "Erreur lors de la récupération du produit");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // Fonction pour ajouter le produit au panier
  async function handleAddToCart() {
  if (!product?.id) return;

  setAdding(true);
  setMessage("");
  setIsError(false);

  try {
    await apiFetch(`/cart/add?product_id=${product.id}&quantity=1`);

    setMessage("Produit ajouté au panier avec succès");
    setIsError(false);
  } catch (err) {
    console.error(err);
    setMessage("Produit introuvable ou erreur API");
    setIsError(true);
  } finally {
    setAdding(false);
  }
}


  if (loading)
    return (
      <p className="text-center mt-20 text-xl font-semibold text-gray-200">
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
    <div className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Image produit */}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="rounded-2xl w-full h-auto object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/400?text=Image+Indisponible";
            }}
          />
        ) : (
          <div className="w-full h-64 bg-gray-800 flex items-center justify-center rounded-2xl">
            <span className="text-gray-400">Aucune image disponible</span>
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-emerald-400 text-2xl mt-4">
            {product.price ? `${product.price} FCFA` : "Prix indisponible"}
          </p>
          <p className="text-gray-300 mt-6">
            {product.description || "Aucune description disponible"}
          </p>

          <button
            className={`mt-8 px-6 py-3 rounded-xl bg-emerald-400 text-gray-900 font-semibold hover:bg-emerald-500 transition ${
              adding ? "opacity-70 cursor-not-allowed" : ""
            }`}
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? "Ajout en cours..." : "Ajouter au panier"}
          </button>

          {message && (
            <p className="mt-4 text-sm text-yellow-400 font-medium">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
