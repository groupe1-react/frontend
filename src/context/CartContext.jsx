import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../api/apiFetch";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Charger le panier depuis l'API
  useEffect(() => {
    async function fetchCart() {
      setLoading(true);
      try {
        const data = await apiFetch("/cart", {
          method: "GET",
        });
        if (data && Array.isArray(data.data)) {
          setCart(data.data);
        } else {
          setCart([]);
        }
      } catch (err) {
        setError("Impossible de récupérer le panier");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  // Ajouter un produit au panier
 async function add(product_id, quantity = 1) {
  setLoading(true);
  try {
    const token=localStorage.getItem("token");
    // POST pour ajouter le produit
    const result = await apiFetch("/cart", {
      method: "POST",
      headers:{
        "Autorization":`Bearer ${token}`
      },
      body: JSON.stringify({ product_id, quantity }),
    });

    // Vérifier si l'API renvoie directement le panier
    const updatedCart = result?.data || result || [];

    setCart(updatedCart);
  } catch (err) {
    setError("Impossible d'ajouter le produit au panier");
  } finally {
    setLoading(false);
  }
}


  // Mettre à jour la quantité d'un produit
  async function update(itemId, quantity) {
    if (quantity < 1) return;
    setLoading(true);
    try {
      await apiFetch(`/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const updated = await apiFetch("/cart", {
        method: "GET",
      });
      setCart(updated.data || []);
    } catch (err) {
      setError("Impossible de mettre à jour la quantité");
    } finally {
      setLoading(false);
    }
  }

  // Supprimer un produit du panier
  async function remove(itemId) {
    setLoading(true);
    try {
      await apiFetch(`/cart/${itemId}`, {
        method: "DELETE",
      });
      setCart(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      setError("Impossible de supprimer le produit");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CartContext.Provider value={{ cart, loading, error, add, update, remove }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook pour utiliser le panier
export function useCart() {
  return useContext(CartContext);
}
