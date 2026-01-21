requireRole("intern");
fillUserTopbar();

const URL = "/feedback/feedback/";

async function load() {
  const tb = qs("rows");
  tb.innerHTML = `<tr><td colspan="4">Loading...</td></tr>`;

  const res = await api(URL);
  const data = await res.json().catch(() => []);
  if (!res.ok) {
    setMsg("msg", data.detail || "Failed to load", true);
    tb.innerHTML = `<tr><td colspan="4">Error</td></tr>`;
    return;
  }

  tb.innerHTML = "";
  if (!data.length) {
    tb.innerHTML = `<tr><td colspan="4">No feedback yet</td></tr>`;
    return;
  }

  data.sort((a,b)=> (a.created_at < b.created_at ? 1 : -1));
  data.forEach(f => {
    tb.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${f.id}</td>
        <td>${shortText(f.comment, 140)}</td>
        <td>${f.supervisor}</td>
        <td>${fmtTS(f.created_at)}</td>
      </tr>
    `);
  });
}

load();
