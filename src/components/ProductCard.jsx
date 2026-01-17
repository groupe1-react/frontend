import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const [adding, setAdding] = useState(false);
  const { add, getItemCount } = useCart();

  const handleAddToCart = async () => {
    if (!product.id) {
      console.error("Produit sans ID:", product);
      return;
    }

    setAdding(true);
    try {
      const success = await add(product.id, 1);
      
      if (success) {
        // Notification visuelle
        console.log("✅ Produit ajouté ! Total items:", getItemCount());
        
        // Tu peux utiliser un toast ici
        // toast.success(`${product.name} ajouté au panier !`);
        
        // Animation de confirmation
        const button = document.activeElement;
        if (button) {
          button.classList.add('bg-green-500');
          setTimeout(() => {
            button.classList.remove('bg-green-500');
          }, 300);
        }
      }
    } catch (error) {
      console.error("❌ Erreur:", error);
      alert("Erreur lors de l'ajout au panier");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={product.image_url || product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 truncate">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mt-2 line-clamp-2 h-10">
          {product.description || "Description non disponible"}
        </p>
        
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-xl font-bold text-blue-600">
              {product.price?.toLocaleString() || "0"} FCFA
            </span>
            {product.original_price && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {product.original_price.toLocaleString()} FCFA
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={adding || !product.stock || product.stock === 0}
            className={`
              px-4 py-2 rounded-lg font-semibold text-white
              transition-all duration-200 min-w-[120px]
              ${adding 
                ? 'bg-blue-400 cursor-wait' 
                : (!product.stock || product.stock === 0)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
              }
            `}
          >
            {adding ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Ajout...
              </div>
            ) : (!product.stock || product.stock === 0) ? (
              'Indisponible'
            ) : (
              'Ajouter au panier'
            )}
          </button>
        </div>
        
        {product.stock > 0 && product.stock <= 5 && (
          <div className="mt-3 text-sm text-orange-600 font-medium">
            ⚠️ Plus que {product.stock} en stock
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;