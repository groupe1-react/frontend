import { useState } from "react";
import { useNavigate } from "react-router-dom";



export default function Home() {
  const [category, setCategory] = useState("all");
  const navigate=useNavigate();

  const products = [
    { id: 1, name: "Galaxy S25", price: 250000, category: "smartphone", image: "/image/smartphone.jpeg" },
    { id: 2, name: "MacBook Pro", price: 350000, category: "ordinateur", image: "/image/macbook.jpeg" },
    { id: 3, name: "AirPods Pro", price: 90000, category: "accessoire", image: "/image/airpodspro.jpeg" },
  ];

  const filteredProducts =
    category === "all"
      ? products
      : products.filter(p => p.category === category);

  return (
    <div className="bg-gray-50">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-bold leading-tight text-gray-900">
            Le meilleur du hardware <br /> commence ici
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Découvrez des produits technologiques premium sélectionnés pour la performance.
          </p>

          <button className="mt-8 px-8 py-4 bg-black text-white rounded-xl text-lg hover:bg-gray-800 transition" onClick={()=>navigate("/products")}>
            Voir les produits
          </button>
        </div>

        <div>
          <img
            src="/image/hardware.jpeg"
            alt="Hardware premium"
            className="rounded-2xl shadow-xl w-2xl "
          />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          Catégories
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {["Smartphones", "Ordinateurs", "Accessoires"].map(cat => (
            <div
              key={cat}
              className="bg-white p-10 rounded-2xl shadow hover:shadow-lg transition text-center cursor-pointer"
            >
              <h3 className="text-xl font-semibold">{cat}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUITS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-semibold">Produits populaires</h2>

          <select
            className="border rounded-lg px-4 py-2"
            onChange={e => setCategory(e.target.value)}
          >
            <option value="all">Tous</option>
            <option value="smartphone">Smartphones</option>
            <option value="ordinateur">Ordinateurs</option>
            <option value="accessoire">Accessoires</option>
          </select>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition p-6"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover rounded-xl"
              />

              <h3 className="mt-6 text-xl font-semibold">
                {product.name}
              </h3>

              <p className="mt-2 text-gray-600">
                {product.price.toLocaleString()} FCFA
              </p>

              <button className="mt-6 w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition">
                Ajouter au panier
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* MARKETING */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
          {[
            "Livraison rapide",
            "Produits certifiés",
            "Paiement sécurisé",
            "Support client 24/7",
          ].map(item => (
            <div key={item} className="text-center">
              <h3 className="text-xl font-semibold">{item}</h3>
              <p className="mt-4 text-gray-600">
                Une expérience premium pensée pour vous.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AVIS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Ce que disent nos clients
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {["Excellent service", "Produits de qualité", "Livraison rapide"].map(
            (avis, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow"
              >
                <p className="text-gray-600">"{avis}"</p>
                <p className="mt-4 font-semibold">Client satisfait</p>
              </div>
            )
          )}
        </div>
      </section>

    </div>
  );
}
