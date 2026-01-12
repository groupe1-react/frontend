// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api/apiFetch";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // récupérer le panier depuis le backend
  const fetchCart = async () => {
    try {
      const data = await apiFetch("/groupe-1/cart", { method: "GET", credentials: "include" });
      setCart(data || []);
    } catch (err) {
      console.error("Erreur lors de la récupération du panier:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  // ajouter un produit au panier via POST
  const addToCart = async (product) => {
    try {
      const data = await apiFetch("/groupe-1/cart", {
        method: "POST",
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
        credentials: "include",
      });
      setCart(data); // on met à jour avec la réponse du backend
    } catch (err) {
      console.error("Erreur lors de l'ajout au panier:", err);
    }
  };

  // supprimer un produit localement (ou via endpoint si disponible)
  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const value = {
    cart,
    loading,
    fetchCart,
    addToCart,
    removeFromCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
