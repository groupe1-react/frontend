import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/products";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Images fixes selon les IDs des produits
  const imageList = {
    5: "/image/sony.jpeg",       // Sony WH-1000XM5
    6: "/image/ipad.jpeg",       // iPad Air
    7: "/image/nintendo.jpeg",   // Nintendo Switch OLED
    8: "/image/logitech.jpeg",   // Logitech MX Master 3S
    1: "/image/produit5.jpeg",   // Produit Modifié
    2: "/image/iphone.jpeg",     // iPhone 15 Pro
    3: "/image/watch.jpeg",      // Samsung Galaxy Watch 6
    4: "/image/macbook.jpeg",    // MacBook Pro 14"
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        if (data && Array.isArray(data.data)) {
          const productsWithImages = data.data.map((product) => ({
            ...product,
            imageUrl: imageList[product.id] || "https://via.placeholder.com/300?text=Image+Indisponible",
          }));
          setProducts(productsWithImages.slice(0, 8)); // <-- limite à 5 produits
        } else {
          setError("Aucun produit disponible");
        }
      } catch (err) {
        setError(err.message || "Erreur lors de la récupération des produits");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-16 py-16 min-h-screen">
      <h2 className="text-3xl font-semibold mb-10 text-center">Découvrez les meilleurs produits tech selectionnés pour vous </h2>

      {loading ? (
        <p className="text-center text-gray-600">Chargement des produits...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600">Aucun produit disponible</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-10">
          {products.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition p-4 sm:p-6 cursor-pointer flex flex-col"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-48 w-full object-cover rounded-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/300?text=Image+Indisponible";
                }}
              />
              <h3 className="mt-4 text-lg sm:text-xl font-semibold">{product.name}</h3>
              <p className="mt-2 text-gray-600 font-medium">{product.price?.toLocaleString()} FCFA</p>
              <button className="mt-6 w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition">
                Ajouter au panier
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
