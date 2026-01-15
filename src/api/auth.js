import { apiFetch } from "./apiFetch";

/**
 * Normalise la réponse de login pour toujours retourner { token, data } ou lever une erreur.
 */
export async function loginUser(credentials) {
  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: credentials,
  });

  // Extraire le token depuis plusieurs formats possibles
  const token =
    res?.token ||
    res?.access_token ||
    res?.data?.token ||
    res?.data?.access_token ||
    res?.meta?.token ||
    null;

  if (!token) {
    const message = res?.message || "Authentification échouée : aucun token reçu du serveur.";
    const err = new Error(message);
    err.body = res;
    throw err;
  }

  return { token, data: res };
}

/**
 * Register : retourne { token?, data }
 */
export async function registerUser(payload) {
  const res = await apiFetch("/auth/register", {
    method: "POST",
    body: payload,
  });

  const token =
    res?.token ||
    res?.access_token ||
    res?.data?.token ||
    res?.data?.access_token ||
    null;

  return { token, data: res };
}

export async function logoutUser() {
  try {
    return await apiFetch("/auth/logout", { method: "POST" });
  } catch (err) {
    return null;
  }
}