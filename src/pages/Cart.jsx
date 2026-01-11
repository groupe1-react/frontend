//fonction qui gere le panier

import { useCart } from "../context/CartContext";

function Cart() {
  const { cart, removeFromCart } = useCart();

  if (cart.length === 0) {
    return <h2 className="empty-cart">Votre panier est vide</h2>;
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h1>Votre panier</h1>

      {cart.map((item) => (
        <div className="cart-item" key={item.id}>
          <img src={item.image} alt={item.name} />

          <div className="cart-info">
            <h3>{item.name}</h3>
            <p>{item.price} FCFA</p>
            <p className="quantity">Quantité : {item.quantity}</p>
          </div>

          <button
            className="remove-btn"
            onClick={() => removeFromCart(item.id)}
          >
            Supprimer
          </button>
        </div>
      ))}

      <div className="cart-total">
        Total : <strong>{total} FCFA</strong>
      </div>
    </div>
  );
}

export default Cart;

