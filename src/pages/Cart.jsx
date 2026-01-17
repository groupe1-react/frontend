import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, loading, update, remove, getTotal } = useCart();
  const total = getTotal();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de votre panier...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 flex items-center justify-center bg-gray-100 rounded-full">
            <svg className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Votre panier est vide</h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Commencez par ajouter quelques produits à votre panier !</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retourner à la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* En-tête mobile */}
        <div className="lg:hidden mb-4">
          <h1 className="text-xl font-bold text-gray-900">Mon Panier</h1>
          <p className="text-sm text-gray-600 mt-1">{cart.length} article{cart.length > 1 ? 's' : ''}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Section principale des articles */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* En-tête desktop */}
              <div className="hidden lg:block px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Mon Panier</h1>
                  <span className="text-sm text-gray-600">{cart.length} article{cart.length > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Liste des articles */}
              <div className="divide-y divide-gray-100">
                {cart.map(item => {
                  const productName = item.product?.name || item.name;
                  const productPrice = item.product?.price || item.price || 0;
                  const productImage = item.product?.image || item.image || item.product?.image_url || "/placeholder-product.jpg";
                  const itemTotal = productPrice * item.quantity;

                  return (
                    <div key={item.id} className="p-3 sm:p-4 lg:p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
                        {/* Image du produit */}
                        <div className="flex-shrink-0 self-center xs:self-start">
                          <div className="relative w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={productImage}
                              alt={productName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/200x200?text=Produit";
                              }}
                            />
                            {item.quantity > 1 && (
                              <div className="absolute top-1 left-1 xs:top-2 xs:left-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {item.quantity > 9 ? '9+' : item.quantity}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Détails du produit */}
                        <div className="flex-1 flex flex-col min-w-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-2">
                              <div className="min-w-0">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                                  {productName}
                                </h3>
                                <div className="mt-1 flex flex-wrap items-center gap-1">
                                  {/* Catégorie si disponible */}
                                  {item.product?.category && (
                                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                      {item.product.category}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right xs:text-right">
                                <p className="text-base sm:text-lg font-bold text-gray-900">
                                  {itemTotal.toLocaleString()} FCFA
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  {productPrice.toLocaleString()} FCFA × {item.quantity}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Contrôles de quantité et suppression */}
                          <div className="flex justify-between items-center mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-2">
                              {/* Bouton - */}
                              <button
                                onClick={() => update(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className={`
                                  w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border text-sm
                                  ${item.quantity <= 1 
                                    ? 'border-gray-300 text-gray-300 cursor-not-allowed' 
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                                  }
                                `}
                              >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                </svg>
                              </button>

                              {/* Quantité */}
                              <span className="w-10 sm:w-12 text-center font-medium text-gray-900 text-sm sm:text-base">
                                {item.quantity}
                              </span>

                              {/* Bouton + */}
                              <button
                                onClick={() => update(item.id, item.quantity + 1)}
                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 text-sm"
                              >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </button>
                            </div>

                            {/* Bouton Supprimer */}
                            <button
                              onClick={() => remove(item.id)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium text-xs sm:text-sm transition-colors"
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span className="hidden xs:inline">Supprimer</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bouton continuer les achats */}
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm sm:text-base transition-colors"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </div>

          {/* Récapitulatif de commande */}
          <div className="lg:w-1/3 mt-6 lg:mt-0">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 lg:sticky lg:top-8">
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Récapitulatif</h2>
              </div>

              <div className="p-4 sm:p-6">
                {/* Détails du total */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Sous-total</span>
                    <span>{total.toLocaleString()} FCFA</span>
                  </div>
                  
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Livraison</span>
                    <span className="text-green-600 font-medium">Gratuite</span>
                  </div>
                  
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Taxes</span>
                    <span>0 FCFA</span>
                  </div>

                  {/* Séparateur */}
                  <div className="border-t border-gray-200 my-3 sm:my-4"></div>

                  {/* Total */}
                  <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{total.toLocaleString()} FCFA</span>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-500 text-center mt-2">
                    TVA incluse
                  </p>
                </div>

                {/* Bouton de validation */}
                <button
                  onClick={() => {
                    // TODO: Implémenter la logique de commande
                    alert("Fonctionnalité de commande à implémenter !");
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base mb-3 sm:mb-4"
                >
                  Procéder au paiement
                </button>

                {/* Paiement sécurisé */}
                <div className="text-center mb-3 sm:mb-0">
                  <div className="flex justify-center items-center gap-2 mb-1 sm:mb-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs sm:text-sm text-gray-600">Paiement 100% sécurisé</span>
                  </div>
                  <div className="flex justify-center gap-2 sm:gap-3">
                    <span className="text-xs text-gray-500">Visa</span>
                    <span className="text-xs text-gray-500">Mastercard</span>
                    <span className="text-xs text-gray-500">PayPal</span>
                  </div>
                </div>

                {/* Code promo (optionnel) */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-2">Code promo</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Entrez votre code"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap">
                      Appliquer
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Information de livraison */}
            <div className="mt-3 sm:mt-4 bg-blue-50 border border-blue-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900">Livraison gratuite</p>
                  <p className="text-xs text-blue-700 mt-1">Votre commande est éligible à la livraison gratuite.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton retour en bas sur mobile */}
        <div className="lg:hidden mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  );
}