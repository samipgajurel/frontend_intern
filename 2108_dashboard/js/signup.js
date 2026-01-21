"use strict";

function showSignupError(form, message) {
  const alertElement = form.querySelector("[data-form-alert]");
  if (!alertElement) {
    console.error(message);
    return;
  }
  alertElement.textContent = message;
  alertElement.classList.remove("d-none");
}

async function handleSignupSubmit(form) {
  const payload = {
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
    phone: form.elements.phone.value.trim(),
    role: form.elements.role.value,
    password: form.elements.password.value,
    confirmPassword: form.elements.password2.value
  };

  if (payload.password !== payload.confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  const response = await window.signupUser(payload);
  const token =
    response &&
    (response.token || response.accessToken || response.jwt || response.data);

  if (token) {
    window.setAuthToken(token);
  }

  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    try {
      await handleSignupSubmit(form);
    } catch (error) {
      showSignupError(form, error.message);
    }
  });
});
