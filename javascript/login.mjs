import { saveToken } from "./auth.mjs";

const AUTH_BASE = "https://v2.api.noroff.dev/auth/login";

export async function loginUser(email, password) {
  const response = await fetch(`${AUTH_BASE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed.");
  }

  const data = await response.json();
  saveToken(data.accessToken);
  return data;
}

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  // checks that loginUser is called with the correct parameters, if true send user to index.html
  try {
    await loginUser(email, password);
    window.location.href = "/index.html"; // To homepage
  } catch (error) {
    alert("Login failed: " + error.message);
  }
});
