"use strict";

function showLoginError(form, message) {
  const alertElement = form.querySelector("[data-form-alert]");
  if (!alertElement) {
    console.error(message);
    return;
  }
  alertElement.textContent = message;
  alertElement.classList.remove("d-none");
}

async function handleLoginSubmit(form) {
  const emailValue = form.elements.email
    ? form.elements.email.value.trim()
    : "";
  const usernameValue = form.elements.username
    ? form.elements.username.value.trim()
    : "";

  const payload = {
    email: emailValue || usernameValue,
    password: form.elements.password.value
  };

  const response = await window.loginUser(payload);
  const token = response && (response.access || response.token);
  const user = response && response.user;
  const role = user && user.role;
  const email = user && user.email;

  if (token) {
    window.setAuthToken(token);
  }
  if (role) {
    window.setUserRole(role);
  }
  if (email) {
    window.setUserEmail(email);
  }

  window.redirectByRole(role);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    try {
      await handleLoginSubmit(form);
    } catch (error) {
      showLoginError(form, error.message);
    }
  });
});
