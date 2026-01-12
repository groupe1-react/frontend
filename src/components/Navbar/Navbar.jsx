import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { logoutUser } from "../../api/auth";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // vérifie si l'utilisateur est connecté

  const handleLogout = async () => {
  await logoutUser();
  localStorage.removeItem("token");
  navigate("/auth");
  };


  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-20 items-center justify-between gap-6">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-tight">
            <span className="text-gray-900">Tech</span>
            <span className="text-indigo-600">Store</span>
          </Link>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center gap-6">
            {!token ? (
              <Link
                to="/auth"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
              >
                Connexion
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-700 transition"
              >
                Déconnexion
              </button>
            )}

            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-indigo-600 transition"
            >
              🛒
              <span className="absolute -top-2 -right-3 h-5 w-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                0
              </span>
            </Link>
          </div>

          {/* Hamburger mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              {menuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 space-y-4">
            
            {!token ? (
              <Link
                to="/auth"
                className="block text-gray-700 hover:text-indigo-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Connexion
              </Link>
            ) : (
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="block text-red-600 hover:text-red-700 font-medium w-full text-left"
              >
                Déconnexion
              </button>
            )}

            <Link
              to="/cart"
              className="block text-gray-700 hover:text-indigo-600 font-medium relative"
              onClick={() => setMenuOpen(false)}
            >
              🛒
              <span className="absolute -top-2 -right-3 h-5 w-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
