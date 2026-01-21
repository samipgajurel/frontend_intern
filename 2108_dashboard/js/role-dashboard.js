"use strict";

async function loadRoleDashboard() {
  const nameTargets = {
    adminName: document.getElementById("adminName"),
    supervisorName: document.getElementById("supervisorName")
  };

  const displayName = window.getUserEmail() || "User";
  if (nameTargets.adminName) {
    nameTargets.adminName.textContent = displayName;
  }
  if (nameTargets.supervisorName) {
    nameTargets.supervisorName.textContent = displayName;
  }
}

document.addEventListener("DOMContentLoaded", loadRoleDashboard);
