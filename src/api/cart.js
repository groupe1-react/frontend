// src/api/cart.js
import { apiFetch } from "./apiFetch";

export function getCart() {
  return apiFetch("/groupe-1/cart", {
    method: "GET",
  });
}

export function addToCart(productId, quantity = 1) {
  return apiFetch("/groupe-1/cart", {
    method: "POST",
    body: JSON.stringify({
      product_id: productId,
      quantity,
    }),
  });
}

export function updateCartItem(id, quantity) {
  return apiFetch(`/groupe-1/cart/${id}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(id) {
  return apiFetch(`/groupe-1/cart/${id}`, {
    method: "DELETE",
  });
}
