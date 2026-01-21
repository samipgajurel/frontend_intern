function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

function getUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

function getAccess() {
  const t = localStorage.getItem("access");
  if (!t) logout();
  return t;
}

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccess()}`,
    },
  });

  if (res.status === 401) logout();
  return res;
}

function requireRole(role) {
  const u = getUser();
  if (!u) logout();
  if (role && u.role !== role) window.location.href = "login.html";
}
