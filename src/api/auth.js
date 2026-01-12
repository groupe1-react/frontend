import { apiFetch } from "./apiFetch";

export function registerUser(userData) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  }) ;
}

export function loginUser(userData) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export async function logoutUser() {
  try {
    const res = await apiFetch("/auth/logout", {
      method: "POST",
      credentials: "include"
    });
    return res;
  } catch (err) {
    console.error("Erreur lors du logout:", err);
    return null; // ou un objet vide
  }
}









