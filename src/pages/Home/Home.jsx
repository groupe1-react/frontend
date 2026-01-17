import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // AJOUT : useLocation
import { getProducts } from "../../api/products";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // AJOUT : État pour le filtrage par prix (Recherche avancée)
  const [maxPrice, setMaxPrice] = useState("");

  const navigate = useNavigate();
  const location = useLocation(); // AJOUT : Pour écouter l'URL

  // Récupération du mot-clé de recherche depuis l'URL (?search=...)
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";

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

  //LOGIQUE DE RECHERCHE ET FILTRAGE 
  const filteredProducts = products.filter((product) => {

    // 1. Filtrage par texte (Nom ou Description)
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // 2. Filtrage par prix
    const matchesPrice = maxPrice === "" || product.price <= Number(maxPrice);

    return matchesSearch && matchesPrice;
  });

  // On limite l'affichage si on est en mode "Populaires" (sans recherche)
  // Sinon on affiche tout ce qui correspond à la recherche
  const productsToDisplay = searchQuery || maxPrice ? filteredProducts : filteredProducts.slice(0, 4);

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-16 py-16 max-w-7xl mx-auto">

      {/* HERO (On le cache si une recherche est active pour plus de clarté) */}
      {!searchQuery && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Le meilleur du hardware <br /> commence ici
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Découvrez des produits technologiques premium sélectionnés pour la performance et la qualité.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="mt-8 px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition"
            >
              Voir les produits
            </button>
          </div>
          <img src="/image/hardware.jpeg" alt="Hardware premium" className="rounded-2xl shadow-xl w-full" />
        </section>
      )}

      {/* SECTION FILTRES (Recherche Avancée) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 bg-white p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold">
            {searchQuery ? `Résultats pour "${searchQuery}"` : "Nos Produits"}
          </h2>
          <p className="text-sm text-gray-500">{filteredProducts.length} produits trouvés</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Budget Max :</label>
          <input
            type="number"
            placeholder="Prix (FCFA)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none w-40"
          />
        </div>
      </div>

      {/* LISTE DES PRODUITS */}
      <section>
        {loading && <p className="text-center text-gray-600">Chargement des produits...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && productsToDisplay.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600">Aucun produit ne correspond à vos critères.</p>
            <button onClick={() => setMaxPrice("")} className="text-indigo-600 mt-2 underline">Voir tout</button>
          </div>
        )}

        {!loading && !error && productsToDisplay.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsToDisplay.map(product => (
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
                <h3 className="mt-6 text-xl font-semibold truncate">{product.name}</h3>
                <p className="mt-2 text-gray-600 font-bold">
                  {product.price?.toLocaleString()} FCFA
                </p>
                <button className="mt-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition">
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
