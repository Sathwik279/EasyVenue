const AUTH_KEY = "easyvenue_auth";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

function getStoredToken() {
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) {
    return null;
  }

  try {
    const { token } = JSON.parse(stored);
    return token || null;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : null;
}

export async function request(path, options = {}) {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  const hasBody = options.body !== undefined && options.body !== null;

  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: hasBody && typeof options.body !== "string"
      ? JSON.stringify(options.body)
      : options.body,
  });

  const data = await parseResponse(response);

  if (response.status === 401) {
    localStorage.removeItem(AUTH_KEY);
    window.dispatchEvent(new CustomEvent("auth:logout"));
  }

  if (!response.ok) {
    const error = new Error(
      data?.error ||
        data?.message ||
        `Request failed with status ${response.status}`,
    );
    error.response = {
      status: response.status,
      data: data || {},
    };
    error.status = response.status;
    error.data = data || {};
    throw error;
  }

  return data;
}
