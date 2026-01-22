import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../api/apiFetch";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Écouter les changements de token
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      setToken(newToken);
      if (newToken) {
        fetchCart(); // Recharger le panier si token change
      } else {
        setCart([]); // Vider le panier si déconnexion
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fonction pour ajouter automatiquement le token aux requêtes
  const makeAuthedRequest = async (url, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }    
    return await apiFetch(url, {
      ...options,
      headers,
    });
  };

  // Charger le panier
  const fetchCart = async () => {
    if (!token) {
      setCart([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await makeAuthedRequest("/cart", {
        method: "GET",
      });

      // Essayer différentes structures de réponse
      let cartItems = [];
      
      if (data && data.data && Array.isArray(data.data)) {
        cartItems = data.data;
      } else if (data && Array.isArray(data)) {
        cartItems = data;
      } else if (data && data.items && Array.isArray(data.items)) {
        cartItems = data.items;
      } else if (data && data.cart && Array.isArray(data.cart)) {
        cartItems = data.cart;
      } else if (data && data.products && Array.isArray(data.products)) {
        cartItems = data.products;
      }
      setCart(cartItems);
      setError("");

    } catch (err) {
      console.error("❌ Erreur fetchCart:", err);
      if (err.message.includes("401") || err.message.includes("403")) {
        setError("Session expirée. Veuillez vous reconnecter.");
        // déconnecter l'utilisateur
        localStorage.removeItem("token");
        setToken(null);
      } else {
        setError("Impossible de récupérer le panier");
      }
    } finally {
      setLoading(false);
    }
  };

  // Charger le panier au démarrage et quand le token change
  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Ajouter un produit
  const add = async (product_id, quantity = 1) => {
    if (!token) {
      setError("Veuillez vous connecter pour ajouter au panier");
      return false;
    }    
    try {
      // POST pour ajouter
      const result = await makeAuthedRequest("/cart", {
        method: "POST",
        body: JSON.stringify({ product_id, quantity }),
      });
      await fetchCart();
      if (result && result.data) {
        const newItem = result.data;
        setCart(prev => {
          // Vérifier si le produit existe déjà
          const existingIndex = prev.findIndex(item => 
            item.product_id === product_id || item.product?.id === product_id
          );
          
          if (existingIndex >= 0) {
            // Mettre à jour la quantité
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity
            };
            return updated;
          } else {
            // Ajouter nouvel item
            return [...prev, newItem];
          }
        });
      }

      return true;
    } catch (err) {
      console.error("❌ Erreur add:", err);
      
      if (err.message.includes("401")) {
        setError("Session expirée. Veuillez vous reconnecter.");
      } else {
        setError(err.message || "Impossible d'ajouter au panier");
      }
      
      return false;
    }
  };

  // Mettre à jour la quantité
  const update = async (itemId, quantity) => {
    if (quantity < 1) return;
    
    try {
      await makeAuthedRequest(`/cart/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      });

      // Mettre à jour localement
      setCart(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      console.error("❌ Erreur update:", err);
      setError("Impossible de mettre à jour");
    }
  };

  // Supprimer un item
  const remove = async (itemId) => {
    try {
      await makeAuthedRequest(`/cart/${itemId}`, {
        method: "DELETE",
      });

      setCart(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error("❌ Erreur remove:", err);
      setError("Impossible de supprimer");
    }
  };

  // Vider le panier
  const clearCart = async () => {
    try {
      await makeAuthedRequest("/cart/clear", { method: "DELETE" });
      setCart([]);
    } catch (err) {
      console.error("❌ Erreur clearCart:", err);
    }
  };

  // Calculs
  const getTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product?.price || item.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      loading, 
      error, 
      token,
      add, 
      update, 
      remove, 
      clearCart,
      getTotal,
      getItemCount,
      refreshCart: fetchCart,
      setToken: (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
      },
      logout: () => {
        localStorage.removeItem("token");
        setToken(null);
        setCart([]);
      }
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé dans CartProvider");
  }
  return context;
}