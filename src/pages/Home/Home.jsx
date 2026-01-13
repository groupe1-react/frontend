import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../api/products";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Images fixes (fallback frontend)
  const imageList = [
    "/image/sony.jpeg",
    "/image/ipad.jpeg",
    "/image/nintendo.jpeg",
    "/image/logitech.jpeg",
    "/image/produit5.jpeg",
    "/image/iphone.jpeg",
    "/image/watch.jpeg",
    "/image/macbook.jpeg",
  ];

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await getProducts();

        if (!response || !Array.isArray(response.data)) {
          throw new Error("Données invalides");
        }

        const productsWithImages = response.data.map((product, index) => ({
          ...product,
          imageUrl: imageList[index] || "/image/no-image.png",
        }));

        setProducts(productsWithImages);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Produits populaires (max 4)
  const popularProducts = products.slice(0, 4);

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-16 py-16 max-w-7xl mx-auto">

      {/* HERO */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Le meilleur du hardware <br /> commence ici
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Découvrez des produits technologiques premium sélectionnés pour la performance.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-8 px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition"
          >
            Voir les produits
          </button>
        </div>

        <img
          src="/image/hardware.jpeg"
          alt="Hardware premium"
          className="rounded-2xl shadow-xl w-full"
        />
      </section>

      {/* PRODUITS POPULAIRES */}
      <section>
        <h2 className="text-3xl font-semibold mb-8">
          Produits populaires
        </h2>

        {loading && (
          <p className="text-center text-gray-600">
            Chargement des produits...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500">
            {error}
          </p>
        )}

        {!loading && !error && popularProducts.length === 0 && (
          <p className="text-center text-gray-600">
            Aucun produit disponible
          </p>
        )}

        {!loading && !error && popularProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularProducts.map(product => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition p-6 cursor-pointer flex flex-col"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-48 w-full object-cover rounded-xl"
                />

                <h3 className="mt-6 text-xl font-semibold">
                  {product.name}
                </h3>

                <p className="mt-2 text-gray-600">
                  {product.price?.toLocaleString()} FCFA
                </p>

                <button
                  className="mt-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
                >
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
