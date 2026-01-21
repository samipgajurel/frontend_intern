"use strict";

const AUTH_TOKEN_KEY = "authToken";
const USER_ROLE_KEY = "userRole";
const USER_EMAIL_KEY = "userEmail";

function getAuthToken() {
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

function setAuthToken(token) {
  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

function getUserRole() {
  return window.localStorage.getItem(USER_ROLE_KEY);
}

function setUserRole(role) {
  if (role) {
    window.localStorage.setItem(USER_ROLE_KEY, role);
  }
}

function getUserEmail() {
  return window.localStorage.getItem(USER_EMAIL_KEY);
}

function setUserEmail(email) {
  if (email) {
    window.localStorage.setItem(USER_EMAIL_KEY, email);
  }
}

function clearAuth() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(USER_ROLE_KEY);
  window.localStorage.removeItem(USER_EMAIL_KEY);
}

function requireAuth() {
  if (!getAuthToken()) {
    window.location.href = "login.html";
  }
}

async function requireRole(roles) {
  requireAuth();
  const role = getUserRole();

  if (!role) {
    window.location.href = "login.html";
    return;
  }

  if (!roles.map(r => r.toLowerCase()).includes(role.toLowerCase())) {
    window.location.href = "index.html";
  }
}

function redirectByRole(role) {
  if (!role) {
    window.location.href = "index.html";
    return;
  }

  const normalized = role.toLowerCase();
  if (normalized === "admin") {
    window.location.href = "admin.html";
    return;
  }
  if (normalized === "supervisor") {
    window.location.href = "supervisor.html";
    return;
  }
  window.location.href = "index.html";
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
  return tryAuthEndpoints(["login", "accounts/login"], credentials);
}

async function signupUser(payload) {
  return tryAuthEndpoints(["register", "accounts/register"], payload);
}

window.getAuthToken = getAuthToken;
window.setAuthToken = setAuthToken;
window.clearAuth = clearAuth;
window.getUserRole = getUserRole;
window.setUserRole = setUserRole;
window.getUserEmail = getUserEmail;
window.setUserEmail = setUserEmail;
window.requireAuth = requireAuth;
window.requireRole = requireRole;
window.loginUser = loginUser;
window.signupUser = signupUser;
window.redirectByRole = redirectByRole;
