import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/products";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 3; // Nombre de produits par page

  // Images fixes selon les IDs des produits
  const imageList = {
    5: "/image/sony.jpeg",       
    6: "/image/ipad.jpeg",       
    7: "/image/nintendo.jpeg",   
    8: "/image/logitech.jpeg",   
    1: "/image/pc.jpeg",   
    2: "/image/iphone.jpeg",     
    3: "/image/watch.jpeg",      
    4: "/image/macbook.jpeg",    
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
          setProducts(productsWithImages); // on stocke tous les produits
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

  if (loading)
    return <p className="text-center text-gray-600 mt-20">Chargement des produits...</p>;

  if (error)
    return <p className="text-center text-red-500 mt-20">{error}</p>;

  if (products.length === 0)
    return <p className="text-center text-gray-600 mt-20">Aucun produit disponible</p>;

  // Pagination
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-16 py-16 min-h-screen">
      <h2 className="text-3xl font-semibold mb-10 text-center">
        Découvrez les meilleurs produits tech sélectionnés pour vous
      </h2>

      {/* Grille de produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-10">
        {paginatedProducts.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition p-4 sm:p-6 cursor-pointer flex flex-col"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-48 w-full object-cover rounded-xl"
              onError={(e) => { e.target.onerror = null;  }}
            />
            <h3 className="mt-4 text-lg sm:text-xl font-semibold">{product.name}</h3>
            <p className="mt-2 text-gray-600 font-medium">{product.price?.toLocaleString()} FCFA</p>
            <button className="mt-6 w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition">
              Ajouter au panier
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-10">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          Précédent
        </button>

        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-black text-white" : ""}`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
