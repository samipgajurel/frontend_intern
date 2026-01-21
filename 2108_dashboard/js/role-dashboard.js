"use strict";

async function loadRoleDashboard() {
  const nameTargets = {
    adminName: document.getElementById("adminName"),
    supervisorName: document.getElementById("supervisorName")
  };

  try {
    const profile = await window.fetchCurrentUser();
    if (!profile) {
      return;
    }

    const displayName =
      profile.name || profile.fullName || profile.username || "User";
    if (nameTargets.adminName) {
      nameTargets.adminName.textContent = displayName;
    }
    if (nameTargets.supervisorName) {
      nameTargets.supervisorName.textContent = displayName;
    }
  } catch (error) {
    console.error("Failed to load profile.", error);
  }
}

document.addEventListener("DOMContentLoaded", loadRoleDashboard);
