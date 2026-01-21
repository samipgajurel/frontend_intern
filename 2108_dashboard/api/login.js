document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg("msg", "");

  const email = qs("email").value.trim();
  const password = qs("password").value;

  try {
    const res = await fetch(`${API_BASE}/accounts/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMsg("msg", data.detail || "Login failed", true);
      return;
    }

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("user", JSON.stringify(data.user));

    if (data.user.role === "supervisor" || data.user.role === "admin") {
      window.location.href = "supervisor-dashboard.html";
    } else {
      window.location.href = "intern-dashboard.html";
    }
  } catch {
    setMsg("msg", "Backend not reachable. Start Django server.", true);
  }
});
