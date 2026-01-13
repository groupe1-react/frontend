import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { add } = useCart(); // <-- utiliser 'add', pas 'addToCart'

  const handleAdd = () => {
    // On ajoute le produit avec quantité = 1
    add(product.id, 1);
  };

  return (
    <div className="product-card bg-white rounded-xl shadow p-4 flex flex-col items-center">
      <img
        src={product.imageUrl || product.image || "/no-image.png"}
        alt={product.name}
        className="h-40 w-full object-cover rounded-xl mb-4"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/no-image.png";
        }}
      />
      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-4">{product.price?.toLocaleString()} FCFA</p>

      <button
        onClick={handleAdd}
        className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        Ajouter au panier
      </button>
    </div>
  );
}

export default ProductCard;
