import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-20 items-center justify-between gap-6">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-tight">
            <span className="text-gray-900">Tech</span>
            <span className="text-indigo-600">Store</span>
          </Link>

          {/* Barre de recherche desktop */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full rounded-full border border-gray-300 bg-gray-50 px-5 py-3 pl-12 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z"
                />
              </svg>
            </div>
          </div>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/auth"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
            >
              Connexion
            </Link>

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
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="w-full rounded-full border border-gray-300 bg-gray-50 px-5 py-3 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
            />
            <Link
              to="/auth"
              className="block text-gray-700 hover:text-indigo-600 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Connexion
            </Link>
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
