"use strict";

async function fetchAccountProfile() {
  const endpoints = ["users/me", "accounts/me", "profile"];
  let lastError;

  for (const path of endpoints) {
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
    console.warn("No account profile endpoint found.", lastError);
  }
  return null;
}

function populateAccountForm(form, profile) {
  if (!profile) {
    return;
  }
  form.elements.name.value = profile.name || profile.fullName || "";
  form.elements.email.value = profile.email || "";
  form.elements.phone.value = profile.phone || profile.phoneNumber || "";
}

function showAccountError(form, message) {
  const alertElement = form.querySelector("[data-form-alert]");
  if (!alertElement) {
    console.error(message);
    return;
  }
  alertElement.textContent = message;
  alertElement.classList.remove("d-none");
}

async function updateAccount(form) {
  const payload = {
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
    password: form.elements.password.value,
    confirmPassword: form.elements.password2.value,
    phone: form.elements.phone.value.trim()
  };

  if (payload.password && payload.password !== payload.confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  const endpoints = ["users/me", "accounts/me"];
  const methods = ["PUT", "PATCH"];
  let lastError;
  for (const endpoint of endpoints) {
    for (const method of methods) {
      try {
        await window.apiFetch(endpoint, {
          method,
          body: JSON.stringify(payload)
        });
        return;
      } catch (error) {
        if (error.status === 404) {
          lastError = error;
          continue;
        }
        throw error;
      }
    }
  }

  if (lastError) {
    throw lastError;
  }
}

async function deleteAccount() {
  const endpoints = ["users/me", "accounts/me"];
  let lastError;
  for (const endpoint of endpoints) {
    try {
      await window.apiFetch(endpoint, { method: "DELETE" });
      window.clearAuth();
      window.location.href = "login.html";
      return;
    } catch (error) {
      if (error.status === 404) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  if (lastError) {
    throw lastError;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("accountForm");
  if (!form) {
    return;
  }

  try {
    const profile = await fetchAccountProfile();
    populateAccountForm(form, profile);
  } catch (error) {
    showAccountError(form, error.message);
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    try {
      await updateAccount(form);
    } catch (error) {
      showAccountError(form, error.message);
    }
  });

  const deleteButton = form.querySelector('[data-action="delete"]');
  if (deleteButton) {
    deleteButton.addEventListener("click", async () => {
      try {
        await deleteAccount();
      } catch (error) {
        showAccountError(form, error.message);
      }
    });
  }
});
