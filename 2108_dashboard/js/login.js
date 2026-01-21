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
  const payload = {
    username: form.elements.username.value.trim(),
    password: form.elements.password.value
  };

  const response = await window.loginUser(payload);
  const token =
    response &&
    (response.token || response.accessToken || response.jwt || response.data);

  if (token) {
    window.setAuthToken(token);
  }

  window.location.href = "index.html";
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
