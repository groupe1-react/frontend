export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Colonne 1: Logo et description */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TechStore
              </h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Votre destination premium pour les dernières innovations technologiques. 
              Qualité, performance et design réunis.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: "🐦", label: "Twitter" },
                { icon: "📘", label: "Facebook" },
                { icon: "📸", label: "Instagram" },
                { icon: "💼", label: "LinkedIn" }
              ].map((social) => (
                <a 
                  key={social.label}
                  href="#" 
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-300 group"
                  aria-label={social.label}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Colonne 2: Navigation rapide */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Navigation Rapide
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Accueil", href: "/" },
                { name: "Boutique", href: "/products" },
                { name: "Nouveautés", href: "/new-arrivals" },
                { name: "Meilleures ventes", href: "/best-sellers" },
                { name: "Promotions", href: "/sales" },
                { name: "À propos", href: "/about" }
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3: Catégories */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Catégories
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Smartphones", count: "24 produits" },
                { name: "Ordinateurs", count: "18 produits" },
                { name: "Montres connectées", count: "12 produits" },
                { name: "Audio & Écouteurs", count: "32 produits" },
                { name: "Gaming", count: "15 produits" },
                { name: "Accessoires", count: "45 produits" }
              ].map((category) => (
                <li key={category.name} className="group">
                  <a 
                    href="#" 
                    className="flex justify-between items-center text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <span>{category.name}</span>
                    <span className="text-xs bg-gray-800 group-hover:bg-gray-700 px-2 py-1 rounded-full transition-colors">
                      {category.count}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4: Contact et Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
              Restez informé
            </h3>
            <p className="text-gray-400 mb-6">
              Inscrivez-vous à notre newsletter pour recevoir les dernières nouveautés et offres exclusives.
            </p>
            
            <form className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-4 py-1.5 rounded-lg font-medium transition-all duration-300"
                >
                  S'inscrire
                </button>
              </div>
            </form>

            {/* Informations de contact */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm">Support 24/7</p>
                  <p className="font-medium text-white">+242 06 806 9454</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm">Email</p>
                  <p className="font-medium text-white">shekinahkitsoro@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Moyens de paiement */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <h4 className="text-center text-gray-400 mb-6 font-medium">Moyens de paiement acceptés</h4>
          <div className="flex flex-wrap justify-center gap-6">
            {["💳", "🏦", "📱", "💰", "🛡️", "🌍"].map((icon, index) => (
              <div 
                key={index} 
                className="w-12 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-xl hover:bg-gray-700 transition-colors"
              >
                {icon}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bas de page */}
      <div className="bg-black py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} <span className="text-blue-400 font-medium">TechStore</span>. Tous droits réservés.
            </div>
            
            <div className="flex items-center gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">CGU</a>
              <a href="#" className="hover:text-white transition-colors">CGV</a>
              <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>

            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Service disponible 24h/24
            </div>
          </div>
        </div>
      </div>

      {/* Retour en haut */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        aria-label="Retour en haut"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
}