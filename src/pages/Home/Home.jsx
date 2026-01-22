import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getProducts } from "../../api/products";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";

  // ✅ MAPPING DES IMAGES STATIQUES FONCTIONNELLES
  const staticImageMap = {
    16: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop&auto=format", // iPhone
    17: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop&auto=format", // Montre
    18: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop&auto=format", // MacBook
    19: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=400&fit=crop&auto=format", // Sony
    21: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop&auto=format", // iPad
    22: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600&h=400&fit=crop&auto=format", // Nintendo
    6: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=400&fit=crop&auto=format", // Gadget
    8: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop&auto=format", // Technology
  };

  // ✅ Images de fallback par catégorie
  const categoryImages = {
    iphone: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop",
    watch: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop",
    macbook: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop",
    sony: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=400&fit=crop",
    ipad: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop",
    nintendo: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600&h=400&fit=crop",
    default: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=400&fit=crop",
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await getProducts();

        let productsArray = [];

        if (Array.isArray(response)) {
          productsArray = response;
        } else if (Array.isArray(response?.data)) {
          productsArray = response.data;
        } else if (Array.isArray(response?.data?.data)) {
          productsArray = response.data.data;
        } else {
          throw new Error("Format de données incorrect");
        }

        // ✅ TRANSFORMATION DES PRODUITS AVEC IMAGES STATIQUES
        const productsWithStaticImages = productsArray.map((product) => {
          // Déterminer l'image à utiliser
          let finalImage;
          
          // 1. D'abord essayer le mapping statique par ID
          if (staticImageMap[product.id]) {
            finalImage = staticImageMap[product.id];
          }
          // 2. Sinon, essayer de déterminer par le nom
          else if (product.name) {
            const name = product.name.toLowerCase();
            if (name.includes("iphone")) finalImage = categoryImages.iphone;
            else if (name.includes("watch")) finalImage = categoryImages.watch;
            else if (name.includes("macbook") || name.includes("mac")) finalImage = categoryImages.macbook;
            else if (name.includes("sony")) finalImage = categoryImages.sony;
            else if (name.includes("ipad")) finalImage = categoryImages.ipad;
            else if (name.includes("nintendo")) finalImage = categoryImages.nintendo;
            else finalImage = categoryImages.default;
          }
          // 3. Fallback par défaut
          else {
            finalImage = categoryImages.default;
          }

          return {
            ...product,
            // On remplace l'URL dynamique par une URL statique
            image: finalImage
          };
        });

        setProducts(productsWithStaticImages);

      } catch (err) {
        console.error("Erreur:", err);
        setError("Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // 🔍 Filtrage
  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchQuery
      ? product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesPrice = maxPrice
      ? Number(product.price) <= Number(maxPrice)
      : true;

    return matchesSearch && matchesPrice;
  });

  const productsToDisplay = searchQuery || maxPrice
    ? filteredProducts
    : filteredProducts.slice(0, 4);

  return (
    <div className="bg-gray-50 min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      {/* HERO SECTION */}
      {!searchQuery && !maxPrice && (
        <section className="mb-12 md:mb-16">
          <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                La technologie <span className="text-blue-400">réinventée</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Découvrez notre sélection exclusive de produits high-tech. 
                Performance, design et innovation à portée de main.
              </p>
              <button
                onClick={() => navigate("/products")}
                className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-4 rounded-xl text-lg transition duration-300 inline-flex items-center gap-2"
              >
                Explorer la boutique
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </button>
            </div>
            {/* Image de fond hero */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop"
                alt="Technologie"
                className="h-full w-full object-cover opacity-20"
              />
            </div>
          </div>
        </section>
      )}

      {/* FILTERS */}
      <div className="mb-8 bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery ? `"${searchQuery}"` : "Nos Produits"}
            </h2>
            <p className="text-gray-600 mt-1">
              {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} disponible{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Budget :</span>
              <input
                type="number"
                placeholder="Max FCFA"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            
            {(searchQuery || maxPrice) && (
              <button
                onClick={() => {
                  setMaxPrice("");
                  navigate("/");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <section>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des produits...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 rounded-2xl">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Réessayer
            </button>
          </div>
        ) : productsToDisplay.length === 0 ? (
          <div className="text-center py-20 bg-gray-100 rounded-2xl">
            <div className="text-gray-400 text-4xl mb-4">🔍</div>
            <p className="text-gray-700 font-medium text-lg mb-2">Aucun produit trouvé</p>
            <p className="text-gray-600">
              {searchQuery 
                ? `Aucun résultat pour "${searchQuery}"`
                : "Essayez de modifier vos critères de recherche"
              }
            </p>
          </div>
        ) : (
          <>
            {/* Section "Produits populaires" */}
            {!searchQuery && !maxPrice && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Produits populaires
                </h3>
                <p className="text-gray-600 text-lg">
                  Découvrez nos produits les plus populaires
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productsToDisplay.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-200 hover:border-blue-300"
                >
                  {/* PRODUCT IMAGE - URL STATIQUE GARANTIE */}
                  <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback ultra simple
                        e.target.src = "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=400&fit=crop";
                        e.target.className = "h-full w-full object-contain p-8";
                      }}
                    />
                    <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                      ID: {product.id}
                    </div>
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description || "Produit high-tech de qualité premium"}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-2xl font-bold text-blue-600">
                        {parseInt(product.price || 0).toLocaleString()} FCFA
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="px-4 py-2 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SEE MORE BUTTON */}
            {!searchQuery && !maxPrice && filteredProducts.length > 4 && (
              <div className="text-center mt-12">
                <button
                  onClick={() => navigate("/products")}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition duration-300 shadow-lg hover:shadow-xl"
                >
                  Voir tous les produits ({filteredProducts.length})
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* FEATURES SECTION */}
      {!searchQuery && !maxPrice && !loading && !error && (
        <section className="mt-16 pt-12 border-t border-gray-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Engagement</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Qualité, innovation et satisfaction client sont au cœur de notre philosophie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "⚡", title: "Livraison Express", desc: "Sous 48h ouvrées" },
              { icon: "🛡️", title: "Garantie 2 Ans", desc: "Sur tous nos produits" },
              { icon: "🌟", title: "Support Premium", desc: "7j/7 par nos experts" }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 text-center hover:border-blue-300 transition">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}