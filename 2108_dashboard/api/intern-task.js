requireRole("intern");
fillUserTopbar();

const URL = "/tasks/tasks/";

async function load() {
  const tb = qs("rows");
  tb.innerHTML = `<tr><td colspan="5">Loading...</td></tr>`;

  const res = await api(URL);
  const data = await res.json().catch(() => []);
  if (!res.ok) {
    setMsg("msg", data.detail || "Failed to load", true);
    tb.innerHTML = `<tr><td colspan="5">Error</td></tr>`;
    return;
  }

  tb.innerHTML = "";
  if (!data.length) {
    tb.innerHTML = `<tr><td colspan="5">No tasks assigned</td></tr>`;
    return;
  }

  data.sort((a,b)=> (a.created_at < b.created_at ? 1 : -1));
  data.forEach(t => {
    tb.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${t.id}</td>
        <td><b>${t.title}</b><div style="font-size:12px;opacity:.8;">${shortText(t.description||"", 90)}</div></td>
        <td>${t.completed ? "Yes" : "No"}</td>
        <td>${fmtTS(t.created_at)}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="toggleDone(${t.id}, ${t.completed})">
            ${t.completed ? "Mark Undone" : "Mark Done"}
          </button>
        </td>
      </tr>
    `);
  });
}

async function toggleDone(id, current) {
  setMsg("msg", "");
  const res = await api(`${URL}${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ completed: !current })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    setMsg("msg", data.detail || "Update failed", true);
    return;
  }
  setMsg("msg", "Updated ✅");
  load();
}
window.toggleDone = toggleDone;

load();
