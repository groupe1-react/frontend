import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ message: "Veuillez vous connecter pour accéder au panier." }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
