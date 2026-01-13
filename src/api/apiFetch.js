const BASE_URL = "https://api.react.nos-apps.com/api/groupe-1";

export async function apiFetch(endpoint, options = {}, useCredentials = false) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...(useCredentials ? { credentials: "include" } : {}), // seulement si nécessaire
    ...options,
  });

  // Essayer de parser le JSON seulement si la réponse est JSON
  let responseData = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    responseData = await response.json().catch(() => null);
  }

  if (!response.ok) {
    const validationErrors = responseData?.errors;
    if (validationErrors) {
      const messages = Object.values(validationErrors).flat().join(", ");
      throw new Error(messages);
    }
    throw new Error(responseData?.message || "Erreur API");
  }

  return responseData;
}
