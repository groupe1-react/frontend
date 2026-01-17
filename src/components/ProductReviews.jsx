import { useState, useMemo, useEffect } from "react";

function Star({ filled, onClick = null, onMouseEnter = null, onMouseLeave = null, ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={ariaLabel}
      className="p-1"
    >
      {filled ? (
        <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.556 2.403c-.784.57-1.84-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.432 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69L9.05 2.927z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.556 2.403c-.784.57-1.84-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.432 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69L9.05 2.927z" />
        </svg>
      )}
    </button>
  );
}

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [ratingHover, setRatingHover] = useState(0);
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState("");
  const [newComment, setNewComment] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const STORAGE_PREFIX = "product_reviews_";
  const MAX_REVIEWS_PER_PRODUCT = 200;

  const storageKey = `${STORAGE_PREFIX}${productId}`;

  // Charge les avis depuis localStorage au montage / quand productId change
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setReviews(parsed);
        else setReviews([]);
      } else {
        setReviews([]);
      }
    } catch (e) {
      console.error("Erreur lecture reviews localStorage", e);
      setReviews([]);
    }
  }, [storageKey]);

  // Ecoute les modifications de localStorage faites dans d'autres onglets
  useEffect(() => {
    function handleStorage(e) {
      if (e.key === storageKey) {
        try {
          const parsed = JSON.parse(e.newValue || "[]");
          setReviews(Array.isArray(parsed) ? parsed : []);
        } catch {
          setReviews([]);
        }
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [storageKey]);

  // Sauvegarde les avis en localStorage
  const persistReviews = (next) => {
    try {
      const toStore = next.slice(0, MAX_REVIEWS_PER_PRODUCT);
      localStorage.setItem(storageKey, JSON.stringify(toStore));
    } catch (e) {
      console.error("Erreur sauvegarde reviews localStorage", e);
    }
  };

  const stats = useMemo(() => {
    const total = reviews.length;
    const avg = total === 0 ? 0 : Math.round((reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10;
    return { total, avg };
  }, [reviews]);

  function formatDate(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return iso;
    }
  }

  function handleAddReview(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newName.trim()) {
      setError("Veuillez indiquer votre nom.");
      return;
    }
    if (!newComment.trim()) {
      setError("Veuillez saisir un commentaire.");
      return;
    }

    const review = {
      id: Date.now(),
      author: newName.trim(),
      rating: newRating,
      comment: newComment.trim(),
      created_at: new Date().toISOString(),
    };

    const next = [review, ...reviews].slice(0, MAX_REVIEWS_PER_PRODUCT);
    setReviews(next);
    persistReviews(next);

    setNewComment("");
    setNewName("");
    setNewRating(5);
    setMessage("Merci — votre avis a bien été ajouté !");
    setTimeout(() => setMessage(""), 3000);
  }

  // Permet de supprimer tous les avis
  function clearReviews() {
    setReviews([]);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Avis des utilisateurs</h2>
          <p className="text-sm text-gray-500">Lisez les avis ou partagez votre expérience.</p>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold">{stats.avg || 0}</div>
            <div className="text-sm text-gray-500">{stats.total} avis</div>
          </div>
        </div>
      </div>

      {/* Formulaire des avis */}
      <form onSubmit={handleAddReview} className="mb-6">
        <div className="bg-transparent p-4 rounded">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Nom</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Votre nom"
                className="w-full bg-transparent border-b-2 border-gray-200 focus:border-indigo-500 py-2 px-1 outline-none text-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Note</label>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const idx = i + 1;
                    return (
                      <Star
                        key={idx}
                        filled={ratingHover ? idx <= ratingHover : idx <= newRating}
                        onClick={() => setNewRating(idx)}
                        onMouseEnter={() => setRatingHover(idx)}
                        onMouseLeave={() => setRatingHover(0)}
                        ariaLabel={`Donner ${idx} étoiles`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-600 mb-1">Commentaire</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Racontez votre expérience..."
              rows={3}
              className="w-full bg-transparent border-b-2 border-gray-200 focus:border-indigo-500 py-2 px-1 outline-none text-sm resize-none"
            />
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="text-sm text-red-600">{error}</div>
            <div className="flex items-center gap-3">
              {message && <div className="text-sm text-green-600">{message}</div>}
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm"
              >
                Poster l'avis
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Liste des avis  */}
      <div className="divide-y divide-gray-100 bg-white rounded-md">
        {reviews.length === 0 ? (
          <div className="p-4 text-gray-600">Aucun avis pour le moment. Soyez le premier à en laisser un !</div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="p-4 flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-medium">
                  {rev.author?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-800">{rev.author}</div>
                    <div className="text-xs text-gray-400">{formatDate(rev.created_at)}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < rev.rating ? "text-yellow-400" : "text-gray-200"}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.556 2.403c-.784.57-1.84-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.432 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69L9.05 2.927z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="mt-2 text-gray-700 whitespace-pre-line">{rev.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>

     
    </div>
  );
}