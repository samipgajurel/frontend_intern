requireRole("intern");
fillUserTopbar();

const ATTENDANCE_URL = "/attendance/attendance/";
const PROGRESS_URL = "/progress/progress/";
const TASKS_URL = "/tasks/tasks/";

function setRows(rows){
  const tb = qs("stats");
  tb.innerHTML = "";
  rows.forEach(r => tb.insertAdjacentHTML("beforeend",
    `<tr><td><b>${r.label}</b></td><td>${r.value}</td></tr>`
  ));
}

async function load(){
  try {
    const aRes = await api(ATTENDANCE_URL);
    const attendance = aRes.ok ? await aRes.json() : [];

    const pRes = await api(PROGRESS_URL);
    const progress = pRes.ok ? await pRes.json() : [];

    const tRes = await api(TASKS_URL);
    const tasks = tRes.ok ? await tRes.json() : [];

    const totalA = attendance.length || 0;
    const presentA = attendance.filter(x => x.present === true).length;
    const pct = totalA ? ((presentA/totalA)*100).toFixed(2) + "%" : "N/A";

    const lastP = progress.length
      ? progress.slice().sort((a,b)=> (a.updated_at < b.updated_at ? 1 : -1))[0]
      : null;

    const doneT = tasks.filter(t => t.completed).length;
    const totalT = tasks.length;

    setRows([
      { label: "Attendance Records", value: totalA ? `${totalA} (Present: ${presentA})` : "N/A" },
      { label: "Attendance %", value: pct },
      { label: "Tasks", value: totalT ? `${doneT}/${totalT} completed` : "N/A" },
      { label: "Latest Progress", value: lastP ? `Project ${lastP.project}: ${lastP.status}` : "N/A" },
      { label: "Last Updated", value: lastP ? fmtTS(lastP.updated_at) : "N/A" },
    ]);

  } catch {
    setMsg("msg", "Backend not reachable.", true);
    setRows([{label:"Status", value:"Server not reachable"}]);
  }
}
load();
