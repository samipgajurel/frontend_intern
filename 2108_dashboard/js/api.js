"use strict";

const API_BASE_URL =
  window.localStorage.getItem("apiBaseUrl") || "http://localhost:3000/api";

function buildApiUrl(path) {
  return `${API_BASE_URL.replace(/\/$/, "")}/${String(path).replace(/^\//, "")}`;
}

async function apiFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : buildApiUrl(path);
  const token = window.localStorage.getItem("authToken");
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(
      errorText || `Request failed with status ${response.status}`
    );
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

window.API_BASE_URL = API_BASE_URL;
window.buildApiUrl = buildApiUrl;
window.apiFetch = apiFetch;
