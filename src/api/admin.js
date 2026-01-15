import { apiFetch } from "./apiFetch";

const UPLOAD_BASE = "api.react.nos-apps.com";

export async function createProduct(payload) {
  return apiFetch("/admin/products", { method: "POST", body: payload });
}

export async function updateProduct(id, payload) {
  return apiFetch(`/admin/products/${id}`, { method: "PUT", body: payload });
}

export async function deleteProduct(id) {
  return apiFetch(`/admin/products/${id}`, { method: "DELETE" });
}

export async function uploadImage(file) {
  const url = `${UPLOAD_BASE}/upload/image`;
  const token = localStorage.getItem("token");
  const form = new FormData();
  form.append("image", file);

  const res = await fetch(url, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });

  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const err = new Error(data?.message || `Upload error (${res.status})`);
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data;
}
