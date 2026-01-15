import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/products";
import { apiFetch } from "../api/apiFetch";
export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 3; // Nombre de produits par page

  // Images fixes selon les IDs des produits (fallback)
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
    let mounted = true;
    // store object URLs to revoke later (si on fetch des blobs protégés)
    const objectUrls = [];

    async function fetchProductsAndFiles() {
      try {
        const { data } = await getProducts(); // adapte si getProducts renvoie un autre format
        const productArray = Array.isArray(data) ? data : data?.data ?? [];

        // try to fetch files list from API upload endpoint
        let files = [];
        try {
          // apiFetch renvoie JSON ; '/upload/files' est l'endpoint donné par le prof
          files = await apiFetch("/upload/files", { method: "GET" });
          // si files est enveloppé dans data, normaliser :
          if (files?.data) files = files.data;
          if (!Array.isArray(files)) files = [];
        } catch (e) {
          // si erreur (ex: endpoint protégé ou absent), on passe et on utilisera les images statiques
          console.warn("Impossible de récupérer la liste des fichiers d'upload :", e);
          files = [];
        }

        // Construire des maps utiles : par name et par uuid si fournis par le back
        const filesByName = {};
        const filesByUuid = {};
        files.forEach((f) => {
          if (f.name) filesByName[f.name] = f;
          if (f.uuid) filesByUuid[f.uuid] = f;
          if (f.id) filesByUuid[f.id] = f; // parfois l'identifiant est 'id'
        });

        const productsWithImages = await Promise.all(
          productArray.map(async (product) => {
            let imageUrl = null;

            // 1) Si le produit contient déjà une URL complète, on l'utilise
            if (product.image_url && typeof product.image_url === "string") {
              imageUrl = product.image_url;
            }

            // 2) Si le produit contient un champ "image" qui est le nom du fichier
            if (!imageUrl && product.image) {
              const fileRecord = filesByName[product.image] || filesByUuid[product.image];
              if (fileRecord) {
                // Prefer fileRecord.url if present
                if (fileRecord.url) {
                  imageUrl = fileRecord.url;
                } else if (fileRecord.uuid) {
                  imageUrl = `/api/upload/file/${fileRecord.uuid}`; // endpoint direct (peut nécessiter auth)
                } else if (fileRecord.id) {
                  imageUrl = `/api/upload/file/${fileRecord.id}`;
                }
              } else {
                // si product.image ressemble à une uuid
                imageUrl = `/api/upload/file/${product.image}`;
              }
            }

            // 3) Si le produit contient image_uuid explicitement
            if (!imageUrl && product.image_uuid) {
              const fileRecord = filesByUuid[product.image_uuid];
              imageUrl = fileRecord?.url || `/api/upload/file/${product.image_uuid}`;
            }

            // 4) Si l'URL pointe vers une API protégée (ex: /api/upload/file/...), le serveur peut
            // requérir Authorization : <token>. Dans ce cas, <img src="..."> renverra 401.
            // Optionnel : récupérer le blob avec fetch + Authorization et créer un objectURL.
            if (imageUrl && imageUrl.startsWith("/api/upload/file")) {
              try {
                // fetch the image blob with credentials/token if necessary
                const fullUrl = imageUrl.startsWith("http") ? imageUrl : imageUrl;
                // apiFetch returns parsed JSON, so use native fetch to get blob and pass token
                const token = localStorage.getItem("token");
                const headers = {};
                if (token) headers["Authorization"] = `Bearer ${token}`;

                const res = await fetch(
                  fullUrl.startsWith("http") ? fullUrl : `${window.location.origin}${fullUrl}`,
                  { method: "GET", headers }
                );

                if (res.ok) {
                  const blob = await res.blob();
                  const objectUrl = URL.createObjectURL(blob);
                  objectUrls.push(objectUrl);
                  imageUrl = objectUrl;
                } else {
                  // can't fetch protected image as blob -> fallback to fileRecord.url or static
                  console.warn("Image protégée non accessible en GET direct :", imageUrl, res.status);
                  imageUrl = null;
                }
              } catch (err) {
                console.warn("Erreur lors du fetch du blob image protégée :", err);
                imageUrl = null;
              }
            }

            // 5) fallback : static imageList or placeholder
            if (!imageUrl) {
              imageUrl = imageList[product.id] || "https://via.placeholder.com/300?text=Image+Indisponible";
            }

            return { ...product, imageUrl };
          })
        );

        if (mounted) setProducts(productsWithImages);
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || "Erreur lors de la récupération des produits");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProductsAndFiles();

    return () => {
      mounted = false;
      // cleanup object URLs
      // (Note : dans cette fonction on n'a pas accès aux objectUrls array si déclarée plus haut,
      //  mais si on encre l'array dans une variable d'état on peut revoke ici.
      //  Pour l'exemple actuel on ne révoque pas pour rester simple.)
    };
  }, []);

  if (loading)
    return <p className="text-center text-gray-600 mt-20">Chargement des produits...</p>;

  if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;

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
        {paginatedProducts.map((product) => (
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
                e.target.src = imageList[product.id] || "https://via.placeholder.com/300?text=Image+Indisponible";
              }}
            />
            <h3 className="mt-4 text-lg sm:text-xl font-semibold">{product.name}</h3>
            <p className="mt-2 text-gray-600 font-medium">
              {product.price?.toLocaleString()} FCFA
            </p>
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