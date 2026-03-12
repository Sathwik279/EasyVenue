import apiClient from "./apiClient";

const AUTH_BASE = "/auth";

export const login = (email, password) =>
  apiClient
    .post(`${AUTH_BASE}/login`, { email, password })
    .then((res) => res.data);

export const register = (name, email, password, role) =>
  apiClient
    .post(`${AUTH_BASE}/register`, { name, email, password, role })
    .then((res) => res.data);
