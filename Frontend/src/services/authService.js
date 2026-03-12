import { request } from "./httpClient";

const AUTH_BASE = "/auth";

export const login = (email, password) =>
  request(`${AUTH_BASE}/login`, {
    method: "POST",
    body: { email, password },
  });

export const register = (name, email, password, role) =>
  request(`${AUTH_BASE}/register`, {
    method: "POST",
    body: { name, email, password, role },
  });
