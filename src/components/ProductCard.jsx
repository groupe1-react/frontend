import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price} FCFA</p>

      <button onClick={() => addToCart(product)}>
        Ajouter au panier
      </button>
    </div>
  );
}

export default ProductCard;
