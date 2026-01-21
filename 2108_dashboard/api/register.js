// // document.getElementById("registerForm").addEventListener("submit", async (e) => {
// //   e.preventDefault();
// //   setMsg("msg", "");

// //   const email = qs("email").value.trim();
// //   const password = qs("password").value;
// //   const role = qs("role").value;

// //   try {
// //     const res = await fetch(`${API_BASE}/accounts/register/`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ email, password, role }),
// //     });

// //     const data = await res.json().catch(() => ({}));

// //     if (!res.ok) {
// //       const k = Object.keys(data)[0];
// //       setMsg("msg", k ? `${k}: ${data[k][0]}` : "Register failed", true);
// //       return;
// //     }

// //     setMsg("msg", "Registered ✅ Now login...");
// //     setTimeout(() => window.location.href = "login.html", 900);
// //   } catch {
// //     setMsg("msg", "Backend not reachable.", true);
// //   }
// // });
// document.getElementById("registerForm").addEventListener("submit", async (e) => {
//   e.preventDefault();
//   setMsg("msg", "");

//   const email = qs("email").value.trim();
//   const password = qs("password").value;
//   const role = qs("role").value;

//   try {
//     const res = await fetch(`${API_BASE}/accounts/register/`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password, role }),
//     });

//     const data = await res.json().catch(() => ({}));

//     if (!res.ok) {
//       const k = Object.keys(data)[0];
//       setMsg("msg", k ? `${k}: ${data[k][0]}` : "Register failed", true);
//       return;
//     }

//     setMsg("msg", "Registered ✅ Now login...");
//     setTimeout(() => window.location.href = "login.html", 900);
//   } catch {
//     setMsg("msg", "Backend not reachable.", true);
//   }
// });

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg("msg", "");

  const email = qs("email").value.trim();
  const password = qs("password").value;
  const roleInput = qs("role").value; // intern/supervisor from dropdown

  if (!email || !password || !roleInput) {
    setMsg("msg", "All fields are required.", true);
    return;
  }

  // ✅ Normalize role to match most backend role choices
  // Backend commonly expects one of:
  // - "intern" / "supervisor"
  // - "Intern" / "Supervisor"
  // - "INTERN" / "SUPERVISOR"
  function mapRoleForBackend(role) {
    const r = (role || "").toLowerCase().trim();

    // Default guess: many Django choices use uppercase constants
    if (r === "intern") return ["INTERN", "Intern", "intern"];
    if (r === "supervisor") return ["SUPERVISOR", "Supervisor", "supervisor"];

    return [role];
  }

  const candidateRoles = mapRoleForBackend(roleInput);

  try {
    // ✅ Try candidate roles until one works (first success wins)
    let lastError = null;

    for (const role of candidateRoles) {
      const res = await fetch(`${API_BASE}/accounts/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      let data = {};
      try { data = await res.json(); } catch { data = {}; }

      if (res.ok) {
        setMsg("msg", "Registered successfully ✅ Redirecting to login...");
        setTimeout(() => (window.location.href = "login.html"), 1000);
        return;
      }

      lastError = { res, data, role };
    }

    // If all candidates fail, show the backend error nicely
    if (lastError) {
      const { data } = lastError;
      const firstKey = Object.keys(data || {})[0];

      if (firstKey) {
        const msg = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
        setMsg("msg", `${firstKey}: ${msg}`, true);
      } else {
        setMsg("msg", "Registration failed.", true);
      }
      return;
    }

    setMsg("msg", "Registration failed.", true);
  } catch (err) {
    setMsg("msg", "Backend not reachable. Is Django running?", true);
  }
});
