requireRole("intern");
fillUserTopbar();

const URL = "/progress/progress/";

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
    tb.innerHTML = `<tr><td colspan="5">No progress records</td></tr>`;
    return;
  }

  data.sort((a,b)=> (a.updated_at < b.updated_at ? 1 : -1));
  data.forEach(p => {
    tb.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${p.id}</td>
        <td>${p.project}</td>
        <td>${p.status}</td>
        <td>${fmtTS(p.updated_at)}</td>
        <td><button class="btn btn-sm btn-warning" onclick="fillEdit(${p.id}, ${p.project}, '${(p.status||'').replace(/'/g,"\\'")}')">Edit</button></td>
      </tr>
    `);
  });
}

function fillEdit(id, project, status) {
  qs("progress_id").value = id;
  qs("project").value = project;
  qs("status").value = status;
  qs("saveBtn").innerText = "Update";
  window.scrollTo({ top: 0, behavior: "smooth" });
}
window.fillEdit = fillEdit;

function resetForm() {
  qs("progress_id").value = "";
  qs("project").value = "";
  qs("status").value = "";
  qs("saveBtn").innerText = "Create";
  setMsg("msg", "");
}
window.resetForm = resetForm;

qs("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg("msg","");

  const id = qs("progress_id").value.trim();
  const payload = {
    project: Number(qs("project").value),
    status: qs("status").value.trim(),
  };

  // intern id is auto-filtered on backend queryset; but model requires intern field.
  // If your backend requires intern explicitly, uncomment below and set user id:
  // payload.intern = getUser().id;

  const method = id ? "PUT" : "POST";
  const path = id ? `${URL}${id}/` : URL;

  const res = await api(path, { method, body: JSON.stringify(payload) });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    setMsg("msg", data.detail || JSON.stringify(data), true);
    return;
  }

  setMsg("msg", id ? "Updated ✅" : "Created ✅");
  resetForm();
  load();
});

resetForm();
load();
