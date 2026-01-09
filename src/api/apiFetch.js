const BASE_URL = "https://api.react.nos-apps.com/api/groupe-1";

export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    const validationErrors = responseData?.errors;
    if (validationErrors) {
      const messages = Object.values(validationErrors)
        .flat()
        .join(", ");
      throw new Error(messages);
    }

    throw new Error(responseData?.message || "Erreur API");
  }

  return responseData;
}
