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
    email: form.elements.email.value.trim(),
    role: form.elements.role.value,
    password: form.elements.password.value
  };

  if (payload.password !== form.elements.password2.value) {
    throw new Error("Passwords do not match.");
  }

  await window.signupUser(payload);
  window.location.href = "login.html";
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
