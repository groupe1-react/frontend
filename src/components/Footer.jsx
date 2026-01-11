export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Logo & description */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">TechStore</h2>
          <p className="text-gray-400">
            La meilleure sélection de produits tech premium, pour une expérience utilisateur exceptionnelle.
          </p>
        </div>

        {/* Liens utiles */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-indigo-500 transition">Accueil</a></li>
            <li><a href="/products" className="hover:text-indigo-500 transition">Produits</a></li>
            <li><a href="/about" className="hover:text-indigo-500 transition">À propos</a></li>
            <li><a href="/contact" className="hover:text-indigo-500 transition">Contact</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li><a href="/faq" className="hover:text-indigo-500 transition">FAQ</a></li>
            <li><a href="/shipping" className="hover:text-indigo-500 transition">Livraison</a></li>
            <li><a href="/returns" className="hover:text-indigo-500 transition">Retours</a></li>
            <li><a href="/terms" className="hover:text-indigo-500 transition">Conditions</a></li>
          </ul>
        </div>

        {/* Réseaux sociaux */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Réseaux sociaux</h3>
          <div className="flex gap-4">
            {/* Facebook */}
            <a href="#" className="hover:text-indigo-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 10-11.5 9.87v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.87 0 1.8.16 1.8.16v2h-1c-1 0-1.3.62-1.3 1.25V12h2.2l-.35 3h-1.85v7A10 10 0 0022 12z"/>
              </svg>
            </a>

            {/* Twitter */}
            <a href="#" className="hover:text-indigo-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04 4.28 4.28 0 00-7.3 3.9A12.14 12.14 0 013 4.89a4.28 4.28 0 001.33 5.71 4.26 4.26 0 01-1.94-.54v.05a4.28 4.28 0 003.44 4.2 4.3 4.3 0 01-1.93.07 4.28 4.28 0 003.99 2.97 8.57 8.57 0 01-5.3 1.83A8.66 8.66 0 012 19.54a12.1 12.1 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56A8.68 8.68 0 0022.46 6z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a href="#" className="hover:text-indigo-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.41a4.92 4.92 0 011.78 1.03c.5.5.85 1.03 1.03 1.78.17.46.356 1.26.41 2.43.058 1.27.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.41 2.43a4.92 4.92 0 01-1.03 1.78 4.92 4.92 0 01-1.78 1.03c-.46.17-1.26.356-2.43.41-1.27.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.41a4.92 4.92 0 01-1.78-1.03 4.92 4.92 0 01-1.03-1.78c-.17-.46-.356-1.26-.41-2.43C2.212 15.584 2.2 15.2 2.2 12s.012-3.584.07-4.85c.054-1.17.24-1.97.41-2.43a4.92 4.92 0 011.03-1.78 4.92 4.92 0 011.78-1.03c.46-.17 1.26-.356 2.43-.41C8.416 2.212 8.8 2.2 12 2.2zm0-2.2C8.735 0 8.332.012 7.052.07 5.77.127 4.842.308 4.07.57a6.92 6.92 0 00-2.5 1.64A6.92 6.92 0 00.57 4.07c-.262.772-.443 1.7-.5 2.982C.012 8.332 0 8.735 0 12s.012 3.668.07 4.948c.057 1.282.238 2.21.5 2.982a6.92 6.92 0 001.64 2.5 6.92 6.92 0 002.5 1.64c.772.262 1.7.443 2.982.5C8.332 23.988 8.735 24 12 24s3.668-.012 4.948-.07c1.282-.057 2.21-.238 2.982-.5a6.92 6.92 0 002.5-1.64 6.92 6.92 0 001.64-2.5c.262-.772.443-1.7.5-2.982.058-1.28.07-1.683.07-4.948s-.012-3.668-.07-4.948c-.057-1.282-.238-2.21-.5-2.982a6.92 6.92 0 00-1.64-2.5 6.92 6.92 0 00-2.5-1.64c-.772-.262-1.7-.443-2.982-.5C15.668.012 15.265 0 12 0z"/>
                <path d="M12 5.838a6.162 6.162 0 106.162 6.162A6.162 6.162 0 0012 5.838zm0 10.162a3.999 3.999 0 113.999-3.999A3.999 3.999 0 0112 16z"/>
                <circle cx="18.406" cy="5.594" r="1.44"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="#" className="hover:text-indigo-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.75v2.2h.07c.66-1.25 2.27-2.55 4.68-2.55 5 0 5.93 3.3 5.93 7.6V24h-5v-7.3c0-1.74-.03-3.98-2.42-3.98-2.42 0-2.79 1.89-2.79 3.85V24h-5V8z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bas de page */}
      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} TechStore. Tous droits réservés.
      </div>
    </footer>
  );
}
