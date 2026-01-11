import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../api/products";

export default function Home() {
  const [category, setCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Images fixes selon l'ordre de l'API
  const imageList = [
    "/image/sony.jpeg",       // Sony WH-1000XM5
    "/image/ipad.jpeg",       // iPad Air
    "/image/nintendo.jpeg",   // Nintendo Switch OLED
    "/image/logitech.jpeg",   // Logitech MX Master 3S
    "/image/produit5.jpeg",   // Produit Modifié
    "/image/iphone.jpeg",     // iPhone 15 Pro
    "/image/watch.jpeg",      // Samsung Galaxy Watch 6
    "/image/macbook.jpeg",    // MacBook Pro 14"
  ];

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        if (data && Array.isArray(data.data)) {
          const productsWithImages = data.data.map((product, index) => ({
            ...product,
            imageUrl: imageList[index] || "https://via.placeholder.com/300?text=Image+Indisponible",
          }));
          setProducts(productsWithImages);
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

  // Filtrage par catégorie et limitation à 5 produits
  const filteredProducts =
    (category === "all"
      ? products
      : products.filter(p => {
          if (category === "smartphone") return p.category?.toLowerCase() === "smartphone";
          if (category === "ordinateur") return p.category?.toLowerCase() === "ordinateur";
          if (category === "accessoire") return p.category?.toLowerCase() === "accessoire";
          return true;
        })
    ).slice(0, 4); // affcihe les produits populaires , maximum 3

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-16 py-16 max-w-7xl mx-auto">
      {/* HERO */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-gray-900">
            Le meilleur du hardware <br /> commence ici
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600">
            Découvrez des produits technologiques premium sélectionnés pour la performance.
          </p>
          <button
            className="mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-black text-white rounded-xl text-base sm:text-lg hover:bg-gray-800 transition"
            onClick={() => navigate("/products")}
          >
            Voir les produits
          </button>
        </div>

        <div>
          <img
            src="/image/hardware.jpeg"
            alt="Hardware premium"
            className="rounded-2xl shadow-xl w-full sm:w-auto"
          />
        </div>
      </section>

      {/* PRODUITS POPULAIRES */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-0">Produits populaires</h2>
          <select
            className="border rounded-lg px-3 py-2"
            onChange={e => setCategory(e.target.value)}
            value={category}
          >
            <option value="all">Tous</option>
            <option value="smartphone">Smartphones</option>
            <option value="ordinateur">Ordinateurs</option>
            <option value="accessoire">Accessoires</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Chargement des produits...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-600">Aucun produit disponible</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition p-4 sm:p-6 cursor-pointer flex flex-col"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-48 sm:h-52 md:h-48 lg:h-52 w-full object-cover rounded-xl"
                />
                <h3 className="mt-4 sm:mt-6 text-lg sm:text-xl font-semibold">{product.name}</h3>
                <p className="mt-2 text-gray-600">{product.price?.toLocaleString()} FCFA</p>
                <button className="mt-4 sm:mt-6 w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition">
                  Ajouter au panier
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
