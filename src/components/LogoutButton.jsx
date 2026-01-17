import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("token"); // nettoyer le frontend
      navigate("/login"); // redirection vers login
    } catch (err) {
      console.error(err);
      alert("Impossible de se déconnecter.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      Déconnexion
    </button>
  );
}
