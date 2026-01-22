import { apiFetch } from "./apiFetch";

export function getCart() {
  return apiFetch("/cart", {  
    method: "GET",
  });
}

export function addToCart(product_id, quantity = 1) {
  return apiFetch("/cart", { 
    method: "POST",
    body: JSON.stringify({
      product_id,
      quantity,
    }),
  });
}

export function updateCartItem(id, quantity) {
  return apiFetch(`/cart/${id}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(id) {
  return apiFetch(`/cart/${id}`, { 
    method: "DELETE",
  });
}