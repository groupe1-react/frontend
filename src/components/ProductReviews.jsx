// src/components/ProductReviews.jsx
import { useState } from "react";

export default function ProductReviews({ productId }) {
  // Avis simulés pour l'instant
  const [reviews, setReviews] = useState([
   
  ]);

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [message, setMessage] = useState("");

  function handleAddReview(e) {
    e.preventDefault();
    if (!newComment) {
      setMessage("Veuillez saisir un commentaire.");
      return;
    }

    // Ajouter l'avis dans l'état local
    const newReview = {
      id: Date.now(),
      author: "Vous",
      rating: newRating,
      comment: newComment,
    };
    setReviews([newReview, ...reviews]);
    setNewComment("");
    setNewRating(5);
    setMessage("Avis ajouté avec succès !");
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Avis des utilisateurs</h2>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleAddReview} className="mb-6">
        <label className="block mb-2 font-medium">Votre note :</label>
        <select
          value={newRating}
          onChange={(e) => setNewRating(Number(e.target.value))}
          className="border rounded px-3 py-2 mb-3"
        >
          <option value={5}>5 étoiles</option>
          <option value={4}>4 étoiles</option>
          <option value={3}>3 étoiles</option>
          <option value={2}>2 étoiles</option>
          <option value={1}>1 étoile</option>
        </select>

        <label className="block mb-2 font-medium">Votre commentaire :</label>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="border rounded px-3 py-2 w-full mb-3"
          rows={3}
        />

        <button
          type="submit"
          className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
        >
          Ajouter mon avis
        </button>

        {message && (
          <p className="mt-2 text-sm text-green-600 font-medium">{message}</p>
        )}
      </form>

      {/* Liste des avis */}
      {reviews.length === 0 ? (
        <p className="text-gray-600">Aucun avis pour le moment.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((rev) => (
            <li key={rev.id} className="border p-4 rounded bg-white shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{rev.author}</span>
                <span className="text-yellow-500">{`${rev.rating} ★`}</span>
              </div>
              <p>{rev.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
