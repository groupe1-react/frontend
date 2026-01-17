// Navbar.jsx - Section corrigée pour le panier
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { logoutUser } from "../../api/auth";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const { getItemCount, getTotal } = useCart();
  const itemCount = getItemCount();
  const cartTotal = getTotal();
  
  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    await logoutUser();
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    if (menuOpen) setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="text-xl sm:text-2xl font-bold tracking-tight shrink-0">
            <span className="text-gray-900">Tech</span>
            <span className="text-indigo-600">Store</span>
          </Link>

          {/* BARRE DE RECHERCHE (Desktop) */}
          <form 
            onSubmit={handleSearch} 
            className="hidden md:flex flex-1 max-w-md relative mx-4"
          >
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm"
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            <Link 
              to="/" 
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Accueil
            </Link>

            {!token ? (
              <Link 
                to="/auth" 
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Connexion
              </Link>
            ) : (
              <button 
                onClick={handleLogout} 
                className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                Déconnexion
              </button>
            )}

            {/* Icône Panier - CORRIGÉ : pas de Link imbriqué */}
            <div className="relative group">
              <Link 
                to="/cart" 
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                {/* Icône SVG */}
                <div className="relative">
                  <svg 
                    className="w-6 h-6 text-gray-700 transition-transform group-hover:scale-110" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  
                  {/* Badge avec nombre d'articles */}
                  {itemCount > 0 && (
                    <span className={`
                      absolute -top-2 -right-2 
                      bg-red-500 text-white 
                      text-xs font-bold 
                      rounded-full h-5 w-5 
                      flex items-center justify-center
                      transition-all duration-300
                      ${itemCount > 9 ? 'h-6 w-6 -top-3 -right-3 text-[10px]' : ''}
                    `}>
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </div>
                
                {/* Total du panier (optionnel) */}
                {itemCount > 0 && (
                  <span className="text-sm font-semibold text-gray-900 hidden lg:inline">
                    {cartTotal.toLocaleString()} FCFA
                  </span>
                )}
              </Link>
              
              {/* Tooltip au survol - SÉPARÉ du Link */}
              <div className="absolute top-full right-0 mt-2 w-64 bg-gray-900 text-white text-sm rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                <div className="font-bold mb-2">Votre panier</div>
                {itemCount === 0 ? (
                  <div className="text-gray-300">Votre panier est vide</div>
                ) : (
                  <>
                    <div className="text-green-400 font-semibold mb-3">
                      {itemCount} article{itemCount > 1 ? 's' : ''} • {cartTotal.toLocaleString()} FCFA
                    </div>
                    <Link 
                      to="/cart"
                      className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 rounded font-medium transition-colors text-sm"
                    >
                      Voir le panier
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions mobile */}
          <div className="md:hidden flex items-center gap-4">
            {/* Icône panier mobile */}
            <Link 
              to="/cart" 
              className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg 
                className="w-6 h-6 text-gray-700" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
            
            {/* Hamburger menu */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="text-gray-700 hover:text-indigo-600 focus:outline-none p-2 hover:bg-gray-50 rounded-lg"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile déroulant */}
        {menuOpen && (
          <div className="md:hidden mt-0 pb-6 border-t border-gray-100 space-y-4 pt-4">
            
            {/* Recherche Mobile */}
            <form onSubmit={handleSearch} className="px-4 mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                />
                <button 
                  type="submit" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Liens mobile */}
            <div className="space-y-2 px-4">
              <Link 
                to="/" 
                className="flex items-center gap-3 py-3 text-gray-700 hover:text-indigo-600 font-medium border-b border-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Accueil
              </Link>

              {!token ? (
                <Link 
                  to="/auth" 
                  className="flex items-center gap-3 py-3 text-gray-700 hover:text-indigo-600 font-medium border-b border-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Connexion
                </Link>
              ) : (
                <button 
                  onClick={() => { handleLogout(); setMenuOpen(false); }} 
                  className="flex items-center gap-3 py-3 text-red-600 hover:text-red-700 font-medium w-full text-left border-b border-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Déconnexion
                </button>
              )}

              <Link 
                to="/cart" 
                className="flex items-center justify-between py-3 text-gray-700 hover:text-indigo-600 font-medium border-b border-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Mon Panier</span>
                </div>
                {itemCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {cartTotal.toLocaleString()} FCFA
                    </span>
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                      {itemCount}
                    </span>
                  </div>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}