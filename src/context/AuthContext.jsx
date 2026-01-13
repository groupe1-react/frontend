import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, logoutUser } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Vérifier l’état d’auth au chargement
  useEffect(() => {
    if (token) {
      setUser({ token }); // simple, suffisant pour ton projet
    }
    setLoading(false);
  }, [token]);

  // LOGIN
  async function login(credentials) {
    const result = await loginUser(credentials);
    localStorage.setItem("token", result.token);
    setToken(result.token);
    setUser({ token: result.token });
  }

  // LOGOUT
  async function logout() {
    try {
      await logoutUser();
    } catch (e) {
      // même si l’API échoue, on force le logout côté frontend
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook custom
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }
  return context;
}
