import { saveToken } from "./auth.mjs";
const AUTH_BASE = "https://v2.api.noroff.dev/auth/register";

const form = document.querySelector("#registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // input values
  const name = form.name.value;
  const email = form.email.value;
  const password = form.password.value;

  try {
    await registerUser(name, email, password);

    // Redirect to login page after successful registration
    alert("Registration successful! Please log in.");
    window.location.href = "/account/login.html";
  } catch (error) {
    // Display error message if registration fails
    alert("Registration failed: " + error.message);
  }
});

export async function registerUser(name, email, password) {
  const url = `${AUTH_BASE}`;

  const body = JSON.stringify({
    name,
    email,
    password,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.message || "Registration failed");
    }

    saveToken(data.data.accessToken, data.data.name || data.data.user.name);
    return data;
  } catch (error) {
    console.error("Registration error:", error.message);
    throw error;
  }
}
