"use strict";

const AUTH_TOKEN_KEY = "authToken";

function getAuthToken() {
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

function setAuthToken(token) {
  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

function clearAuth() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

function requireAuth() {
  if (!getAuthToken()) {
    window.location.href = "login.html";
  }
}

async function tryAuthEndpoints(paths, payload) {
  let lastError;
  for (const path of paths) {
    try {
      return await window.apiFetch(path, {
        method: "POST",
        body: JSON.stringify(payload)
      });
    } catch (error) {
      if (error.status === 404) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }
  throw lastError || new Error("Authentication endpoint not found.");
}

async function loginUser(credentials) {
  return tryAuthEndpoints(["auth/login", "login"], credentials);
}

async function signupUser(payload) {
  return tryAuthEndpoints(
    ["auth/signup", "auth/register", "signup", "register"],
    payload
  );
}

window.getAuthToken = getAuthToken;
window.setAuthToken = setAuthToken;
window.clearAuth = clearAuth;
window.requireAuth = requireAuth;
window.loginUser = loginUser;
window.signupUser = signupUser;
