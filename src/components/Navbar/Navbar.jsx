import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { logoutUser } from "../../api/auth";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // État pour capturer la saisie
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    await logoutUser();
    localStorage.removeItem("token");
    navigate("/auth");
  };

  // CETTE FONCTION PERMET DE RECHERCHER RÉELLEMENT
  const handleSearch = (e) => {
    e.preventDefault();
    // On navigue vers la page d'accueil avec le paramètre de recherche
    // Exemple : /?search=iphone
    navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    if (menuOpen) setMenuOpen(false); 
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-20 items-center justify-between gap-6">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-tight shrink-0">
            <span className="text-gray-900">Tech</span>
            <span className="text-indigo-600">Store</span>
          </Link>

          {/* BARRE DE RECHERCHE (Desktop) - Design conservé */}
          <form 
            onSubmit={handleSearch} 
            className="hidden md:flex flex-1 max-w-md relative"
          >
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:border-indigo-600 text-sm"
            />
            <button type="submit" className="absolute right-3 top-2 text-gray-400 hover:text-indigo-600">
              🔍
            </button>
          </form>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
              Accueil
            </Link>

            {!token ? (
              <Link to="/auth" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
                Connexion
              </Link>
            ) : (
              <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-700 transition">
                Déconnexion
              </button>
            )}

            <Link to="/cart" className="relative text-gray-700 hover:text-indigo-600 transition text-xl">
              🛒
            </Link>
          </div>

          {/* Hamburger mobile */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 hover:text-indigo-600 focus:outline-none">
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

        {/* Menu mobile */}
        {menuOpen && (
          <div className="md:hidden mt-0 pb-6 border-t border-gray-100 space-y-4 pt-4">
            
            {/* Recherche Mobile */}
            <form onSubmit={handleSearch} className="px-2 mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-indigo-600"
                />
                <button type="submit" className="absolute right-3 top-2">🔍</button>
              </div>
            </form>

            <Link to="/" className="block text-gray-700 hover:text-indigo-600 font-medium px-2" onClick={() => setMenuOpen(false)}>
              Accueil
            </Link>

            {!token ? (
              <Link to="/auth" className="block text-gray-700 hover:text-indigo-600 font-medium px-2" onClick={() => setMenuOpen(false)}>
                Connexion
              </Link>
            ) : (
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block text-red-600 hover:text-red-700 font-medium w-full text-left px-2">
                Déconnexion
              </button>
            )}

            <Link to="/cart" className="block text-gray-700 hover:text-indigo-600 font-medium px-2" onClick={() => setMenuOpen(false)}>
              Mon Panier 🛒
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
