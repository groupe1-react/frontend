import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, loading, update, remove } = useCart();

  if (loading) return <p className="text-center mt-20">Chargement du panier...</p>;
  if (!cart || cart.length === 0) return <p className="text-center mt-20">Votre panier est vide</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mon Panier</h1>
      <ul className="space-y-4">
        {cart.map(item => (
          <li key={item.id} className="flex justify-between items-center border p-4 rounded">
            <div>
              <p className="font-semibold">{item.product?.name || item.name}</p>
              <p>Quantité : {item.quantity}</p>
              <p className="text-gray-600">{item.product?.price?.toLocaleString() || item.price} FCFA</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => update(item.id, item.quantity + 1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
              <button
                onClick={() => update(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                −
              </button>
              <button
                onClick={() => remove(item.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
