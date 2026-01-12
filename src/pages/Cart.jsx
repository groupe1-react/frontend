import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, loading, removeFromCart } = useCart();

  if (loading) return <p>Chargement du panier...</p>;
  if (cart.length === 0) return <p>Votre panier est vide.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mon Panier</h1>
      <ul className="space-y-4">
        {cart.map(item => (
          <li key={item.id} className="flex justify-between items-center border p-4 rounded">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p>Quantité: {item.quantity}</p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}