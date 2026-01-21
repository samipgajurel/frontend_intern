requireRole("supervisor");
fillUserTopbar();

const ENDPOINTS = {
  interns: "/interns/",
  analytics: "/analytics/",
  attendance: "/attendance/attendance/",
  projects: "/projects/projects/",
  progress: "/progress/progress/",
  feedback: "/feedback/feedback/",
};

async function safeGet(path) {
  try {
    const res = await api(path);
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}

function setKPI(id, val) {
  const el = qs(id);
  if (el) el.innerText = val;
}

function renderAnalytics(rows) {
  const tb = qs("analyticsRows");
  tb.innerHTML = "";

  if (!Array.isArray(rows) || rows.length === 0) {
    tb.innerHTML = `<tr><td colspan="4">No analytics data</td></tr>`;
    return;
  }

  rows.sort((a, b) => (a.attendance ?? 0) - (b.attendance ?? 0));
  rows.forEach(r => {
    tb.insertAdjacentHTML("beforeend", `
      <tr>
        <td><b>${r.intern ?? "-"}</b></td>
        <td>${(r.attendance ?? 0)}%</td>
        <td>${r.progress ?? "N/A"}</td>
        <td>${r.completed_tasks ?? 0}</td>
      </tr>
    `);
  });
}

function renderActivity(progress, feedback) {
  const tb = qs("activityRows");
  tb.innerHTML = "";

  const items = [];

  if (Array.isArray(progress)) {
    progress.forEach(p => items.push({
      type: "Progress",
      info: `Intern ${p.intern} • Project ${p.project} • ${p.status}`,
      time: p.updated_at
    }));
  }

  if (Array.isArray(feedback)) {
    feedback.forEach(f => items.push({
      type: "Feedback",
      info: `Intern ${f.intern} • ${shortText(f.comment, 80)}`,
      time: f.created_at
    }));
  }

  if (!items.length) {
    tb.innerHTML = `<tr><td colspan="3">No recent activity</td></tr>`;
    return;
  }

  items.sort((a, b) => ((a.time || "") < (b.time || "") ? 1 : -1));
  items.slice(0, 10).forEach(i => {
    tb.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${i.type}</td>
        <td>${i.info}</td>
        <td>${fmtTS(i.time)}</td>
      </tr>
    `);
  });
}

async function loadDashboard() {
  const [internsR, analyticsR, attendanceR, projectsR, progressR, feedbackR] = await Promise.all([
    safeGet(ENDPOINTS.interns),
    safeGet(ENDPOINTS.analytics),
    safeGet(ENDPOINTS.attendance),
    safeGet(ENDPOINTS.projects),
    safeGet(ENDPOINTS.progress),
    safeGet(ENDPOINTS.feedback),
  ]);

  setKPI("kpiInterns", internsR.ok && Array.isArray(internsR.data) ? internsR.data.length : "—");
  setKPI("kpiAttendance", attendanceR.ok && Array.isArray(attendanceR.data) ? attendanceR.data.length : "—");
  setKPI("kpiProjects", projectsR.ok && Array.isArray(projectsR.data) ? projectsR.data.length : "—");
  setKPI("kpiFeedback", feedbackR.ok && Array.isArray(feedbackR.data) ? feedbackR.data.length : "—");

  renderAnalytics(analyticsR.ok ? analyticsR.data : []);
  renderActivity(progressR.ok ? progressR.data : [], feedbackR.ok ? feedbackR.data : []);

  const failed = [];
  if (!internsR.ok) failed.push(`interns (${internsR.status})`);
  if (!analyticsR.ok) failed.push(`analytics (${analyticsR.status})`);
  if (!attendanceR.ok) failed.push(`attendance (${attendanceR.status})`);
  if (!projectsR.ok) failed.push(`projects (${projectsR.status})`);
  if (!progressR.ok) failed.push(`progress (${progressR.status})`);
  if (!feedbackR.ok) failed.push(`feedback (${feedbackR.status})`);
  if (failed.length) setMsg("msg", `Some endpoints failed: ${failed.join(", ")}`, true);
}
loadDashboard();
