"use strict";

function normalizeIntern(intern, index) {
  return {
    id: intern.id || intern._id || intern.uuid || index,
    name:
      intern.name ||
      intern.fullName ||
      intern.full_name ||
      intern.internName ||
      "Unknown",
    email: intern.email || intern.emailAddress || intern.email_address || "—",
    department: intern.department || intern.domain || intern.track || "—",
    startDate: intern.startDate || intern.start_date || intern.start || "",
    status: intern.status || intern.state || "Active"
  };
}

function getStatusBadgeClass(status) {
  const normalized = status.toLowerCase();
  if (normalized.includes("active")) {
    return "badge-success";
  }
  if (normalized.includes("hold")) {
    return "badge-warning";
  }
  if (normalized.includes("complete")) {
    return "badge-secondary";
  }
  return "badge-info";
}

function renderInternRow(intern, index) {
  const row = document.createElement("tr");
  row.dataset.internId = intern.id;

  const countCell = document.createElement("td");
  countCell.textContent = index + 1;

  const nameCell = document.createElement("td");
  nameCell.textContent = intern.name;

  const emailCell = document.createElement("td");
  emailCell.textContent = intern.email;

  const departmentCell = document.createElement("td");
  departmentCell.textContent = intern.department;

  const dateCell = document.createElement("td");
  dateCell.textContent = intern.startDate || "—";

  const statusCell = document.createElement("td");
  const statusBadge = document.createElement("span");
  statusBadge.className = `badge ${getStatusBadgeClass(intern.status)}`;
  statusBadge.textContent = intern.status;
  statusCell.appendChild(statusBadge);

  row.append(
    countCell,
    nameCell,
    emailCell,
    departmentCell,
    dateCell,
    statusCell
  );

  return row;
}

function renderEmptyRow() {
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.colSpan = 6;
  cell.className = "text-center";
  cell.textContent = "No interns available.";
  row.appendChild(cell);
  return row;
}

async function loadInterns(tableBody) {
  try {
    const data = await window.apiFetch("interns");
    if (!Array.isArray(data)) {
      return;
    }

    tableBody.innerHTML = "";
    if (data.length === 0) {
      tableBody.appendChild(renderEmptyRow());
      return;
    }

    data
      .map(normalizeIntern)
      .forEach((intern, index) =>
        tableBody.appendChild(renderInternRow(intern, index))
      );
  } catch (error) {
    console.error("Failed to load interns.", error);
  }
}

function showFormError(form, message) {
  const alertElement = form.querySelector("[data-form-alert]");
  if (!alertElement) {
    console.error(message);
    return;
  }
  alertElement.textContent = message;
  alertElement.classList.remove("d-none");
}

async function handleAddInternSubmit(form) {
  const payload = {
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
    department: form.elements.department.value,
    startDate: form.elements.startDate.value,
    status: form.elements.status.value
  };

  await window.apiFetch("interns", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  window.location.href = "interns.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("internsTableBody");
  if (tableBody) {
    loadInterns(tableBody);
  }

  const addInternForm = document.getElementById("addInternForm");
  if (addInternForm) {
    addInternForm.addEventListener("submit", async event => {
      event.preventDefault();
      try {
        await handleAddInternSubmit(addInternForm);
      } catch (error) {
        showFormError(addInternForm, error.message);
      }
    });
  }
});
