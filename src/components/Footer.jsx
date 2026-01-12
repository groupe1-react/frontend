export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-5 px-2">
      <div className="max-w-7xl mx-auto grid grid-cols- md:grid-cols-1 gap-4">
        
        {/* Logo & description */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">TechStore</h2>
          <p className="text-gray-400">
            La meilleure sélection de produits tech premium, pour une expérience utilisateur exceptionnelle.
          </p>
        </div>
      </div>

      {/* Bas de page */}
      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} TechStore. Tous droits réservés.
      </div>
    </footer>
  );
}
