const BASE_URL = "https://api.react.nos-apps.com/api/groupe-1";

export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  // Headers sûrs
  const headers = new Headers(options.headers || {});

  // Si body est un objet (pas FormData) : stringify + Content-Type JSON
  if (options.body && typeof options.body !== "string" && !(options.body instanceof FormData)) {
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    const ct = headers.get("Content-Type") || "";
    if (ct.includes("application/json")) {
      options.body = JSON.stringify(options.body);
    }
  }

  // Lire le token depuis localStorage (clé "token" par convention)
  const token = localStorage.getItem("token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    headers.delete("Authorization");
  }

  // Eviter d'envoyer Authorization: Bearer undefined
  const auth = headers.get("Authorization");
  if (!auth || auth.includes("undefined")) {
    headers.delete("Authorization");
  }

  const fetchOpts = {
    credentials: options.credentials ?? "omit", // 'omit' si on utilise token bearer ; use 'include' si cookie/session
    ...options,
    headers,
  };

  const response = await fetch(url, fetchOpts);

  // Parser la réponse proprement
  let responseData = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }
  } else {
    responseData = await response.text().catch(() => null);
  }

  if (!response.ok) {
    // Supporter les erreurs de validation renvoyées par l'API
    const validationErrors = responseData?.errors;
    if (validationErrors) {
      const messages = Object.values(validationErrors).flat().join(", ");
      const err = new Error(messages);
      err.status = response.status;
      err.body = responseData;
      throw err;
    }
    const err = new Error(responseData?.message || `Erreur API (${response.status})`);
    err.status = response.status;
    err.body = responseData;
    throw err;
  }

  return responseData;
}