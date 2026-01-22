import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  async function login(credentials) {
    const res = await fetch("https://api.react.nos-apps.com/api/groupe-1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || `Login failed (${res.status})`);
    }
    setToken(data.token);
    setUser(data.user ?? null);
    return data;
  }

  async function register(payload) {
    const res = await fetch("https://api.react.nos-apps.com/api/groupe-1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || `Register failed (${res.status})`);
    }
    //auto-login si la réponse contient token
    if (data.token) {
      setToken(data.token);
      setUser(data.user ?? null);
    }
    return data;
  }

  function logout() {
    setToken(null);
    setUser(null);
    // appeler endpoint /logout
  }

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}