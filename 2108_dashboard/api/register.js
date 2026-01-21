document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg("msg", "");

  const email = qs("email").value.trim();
  const password = qs("password").value;
  const role = qs("role").value;

  try {
    const res = await fetch(`${API_BASE}/accounts/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const k = Object.keys(data)[0];
      setMsg("msg", k ? `${k}: ${data[k][0]}` : "Register failed", true);
      return;
    }

    setMsg("msg", "Registered ✅ Now login...");
    setTimeout(() => window.location.href = "login.html", 900);
  } catch {
    setMsg("msg", "Backend not reachable.", true);
  }
});
