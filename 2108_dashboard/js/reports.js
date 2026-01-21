"use strict";

function normalizeReportRow(intern) {
  const completed =
    intern.completed_tasks ||
    intern.completedTasks ||
    intern.tasksCompleted ||
    0;
  const total =
    intern.total_tasks || intern.totalTasks || intern.tasksTotal || 0;
  const progressValue =
    intern.progress ||
    intern.progressPercent ||
    (total ? Math.round((completed / total) * 100) : 0);

  return {
    name: intern.user || intern.name || intern.fullName || "Unknown",
    domain: intern.domain || intern.department || intern.track || "—",
    completed,
    total,
    progress: progressValue
  };
}

function renderReportRow(entry) {
  const row = document.createElement("tr");
  const status = entry.progress >= 70 ? "Good" : "Needs Improvement";
  row.innerHTML = `
        <td>${entry.name}</td>
        <td>${entry.domain}</td>
        <td>${entry.completed}</td>
        <td>${entry.total}</td>
        <td>${entry.progress}%</td>
        <td>${status}</td>
    `;
  return row;
}

async function loadReport() {
  const reportBody = document.getElementById("reportBody");
  if (!reportBody) {
    return;
  }

  try {
    const data = await window.apiFetch("interns");
    if (!Array.isArray(data)) {
      return;
    }

    reportBody.innerHTML = "";
    data
      .map(normalizeReportRow)
      .forEach(entry => reportBody.appendChild(renderReportRow(entry)));
  } catch (error) {
    console.error("Failed to load report data.", error);
  }
}

document.addEventListener("DOMContentLoaded", loadReport);
