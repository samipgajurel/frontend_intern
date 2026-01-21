requireRole("intern");
fillUserTopbar();

const URL = "/attendance/attendance/";

async function load(){
  const tb = qs("rows");
  tb.innerHTML = `<tr><td colspan="4">Loading...</td></tr>`;

  const res = await api(URL);
  const data = await res.json().catch(()=>[]);
  if(!res.ok){
    setMsg("msg", data.detail || "Failed to load", true);
    tb.innerHTML = `<tr><td colspan="4">Error</td></tr>`;
    return;
  }

  tb.innerHTML = "";
  if(!data.length){
    tb.innerHTML = `<tr><td colspan="4">No records</td></tr>`;
    return;
  }

  data.sort((a,b)=> (a.date < b.date ? 1 : -1));
  data.forEach(r=>{
    tb.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${r.id}</td>
        <td>${r.date}</td>
        <td>${r.present ? "Yes" : "No"}</td>
        <td>${r.marked_by ?? "-"}</td>
      </tr>
    `);
  });
}
load();
