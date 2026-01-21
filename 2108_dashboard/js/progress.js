"use strict";

async function fetchFirstAvailable(paths) {
  let lastError;
  for (const path of paths) {
    try {
      return await window.apiFetch(path);
    } catch (error) {
      if (error.status === 404) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }
  if (lastError) {
    console.warn("No progress endpoint found.", lastError);
  }
  return null;
}

function normalizeProgressEntry(entry, index) {
  const completed =
    entry.completed_tasks ||
    entry.completedTasks ||
    entry.tasksCompleted ||
    0;
  const total = entry.total_tasks || entry.totalTasks || entry.tasksTotal || 0;
  return {
    id: entry.id || entry._id || index,
    name: entry.name || entry.user || entry.internName || "Unknown",
    completed,
    total,
    endDate: entry.endDate || entry.end_date || entry.internshipEndDate || "—"
  };
}

function renderProgressRow(entry, index) {
  const row = document.createElement("tr");
  row.innerHTML = `
        <th><input type="checkbox"></th>
        <td class="tm-intern-name">${index + 1}. ${entry.name}</td>
        <td class="text-center">${entry.completed}</td>
        <td class="text-center">${entry.total}</td>
        <td>${entry.endDate}</td>
        <td><i class="fas fa-trash-alt tm-trash-icon"></i></td>
    `;
  return row;
}

function normalizeDomain(entry, index) {
  return entry.name || entry.domain || entry.title || `${index + 1}. Domain`;
}

function renderDomainRow(domain, index) {
  const row = document.createElement("tr");
  row.innerHTML = `
        <td>${index + 1}. ${domain}</td>
        <td class="tm-trash-icon-cell">
            <i class="fas fa-trash-alt tm-trash-icon"></i>
        </td>
    `;
  return row;
}

async function loadProgress() {
  const tableBody = document.getElementById("progressTableBody");
  if (!tableBody) {
    return;
  }

  try {
    const data = await fetchFirstAvailable(["interns/progress", "progress"]);
    if (!Array.isArray(data)) {
      return;
    }

    tableBody.innerHTML = "";
    data
      .map(normalizeProgressEntry)
      .forEach((entry, index) =>
        tableBody.appendChild(renderProgressRow(entry, index))
      );
  } catch (error) {
    console.error("Failed to load progress.", error);
  }
}

async function loadDomains() {
  const domainBody = document.getElementById("domainsTableBody");
  if (!domainBody) {
    return;
  }

  try {
    const data = await fetchFirstAvailable(["domains", "intern-domains"]);
    if (!Array.isArray(data)) {
      return;
    }

    domainBody.innerHTML = "";
    data
      .map(normalizeDomain)
      .forEach((domain, index) =>
        domainBody.appendChild(renderDomainRow(domain, index))
      );
  } catch (error) {
    console.error("Failed to load domains.", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadProgress();
  loadDomains();

  document.addEventListener("click", event => {
    if (event.target.classList.contains("tm-intern-name")) {
      window.location.href = "edit-intern.html";
    }
  });
});
