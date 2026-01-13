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
        const data = await apiFetch("/groupe-1/cart", {
          method: "GET",
          credentials: "include",
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
 async function add(productId, quantity = 1) {
  setLoading(true);
  try {
    // POST pour ajouter le produit
    const result = await apiFetch("/groupe-1/cart", {
      method: "POST",
      credentials: "include", // très important si le panier est lié au cookie/session
      body: JSON.stringify({ product_id: productId, quantity }),
    });

    // Vérifier si l'API renvoie directement le panier
    const updatedCart = result?.data || result || [];

    setCart(updatedCart);
  } catch (err) {
    console.error(err);
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
      await apiFetch(`/groupe-1/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity }),
      });
      const updated = await apiFetch("/groupe-1/cart", {
        method: "GET",
        credentials: "include",
      });
      setCart(updated.data || []);
    } catch (err) {
      console.error(err);
      setError("Impossible de mettre à jour la quantité");
    } finally {
      setLoading(false);
    }
  }

  // Supprimer un produit du panier
  async function remove(itemId) {
    setLoading(true);
    try {
      await apiFetch(`/groupe-1/cart/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setCart(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error(err);
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
