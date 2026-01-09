import { apiFetch } from "./apiFetch";

export function registerUser(userData) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function loginUser(userData) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

