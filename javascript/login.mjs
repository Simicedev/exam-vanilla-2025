import { saveToken } from "./auth.mjs";

const AUTH_BASE = "https://v2.api.noroff.dev/auth/login";

export async function loginUser(email, password) {
  try {
    const response = await fetch(AUTH_BASE, {
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
    console.log("API Response:", data);
    // accessToken and username
    if (data && data.data && data.data.name && data.data.accessToken) {
      // If username and access token exist in the response, they get saved
      saveToken(data.data.accessToken, data.data.name);
    } else {
      throw new Error("User name or access token not found in response.");
    }

    return data;
  } catch (error) {
    console.error("Error during login:", error.message);
    throw error; // Re-throw the error to be caught in the calling code
  }
}

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  try {
    await loginUser(email, password);
    window.location.href = "/index.html"; // Redirect to homepage on successful login
  } catch (error) {
    alert("Login failed: " + error.message); // Alert user on login failure
  }
});
