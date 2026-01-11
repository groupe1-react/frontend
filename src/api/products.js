import { apiFetch } from "./apiFetch";

// récupérer tous les produits
export function getProducts() {
  return apiFetch("/products");
}

// récupérer un produit par id
export function getProductById(id) {
  return apiFetch(`/products/${id}`);
}
