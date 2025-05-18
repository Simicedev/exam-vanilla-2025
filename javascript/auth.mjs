// Save token
export function saveToken(token, username) {
  localStorage.setItem("accessToken", token);
  localStorage.setItem("username", username);
}

// Get token
export function getToken() {
  return localStorage.getItem("accessToken");
}

// Remove token
export function removeToken() {
  localStorage.removeItem("accessToken");
  window.location.href = "/account/login.html";
}

export function isLoggedIn() {
  return getToken() !== null; // If there's a token, the user is logged in
}

export function getUsername() {
  return localStorage.getItem("username");
}

export function updateNavBar() {
  const isLoggedInState = isLoggedIn();
  const loginLink = document.getElementById("login-link");
  const registerLink = document.getElementById("register-link");
  const signOutLink = document.getElementById("signout-link");
  const blogFeedLink = document.getElementById("blog-feed-link");

  if (isLoggedInState) {
    loginLink.style.display = "none";
    registerLink.style.display = "none";
    signOutLink.style.display = "inline";
    if (blogFeedLink) {
      blogFeedLink.style.display = "list-item";
    }
  } else {
    loginLink.style.display = "inline";
    registerLink.style.display = "inline";
    signOutLink.style.display = "none";
    if (blogFeedLink) {
      blogFeedLink.style.display = "none";
    }
  }
}

// Call function when the page loads
export function initializeNavbar() {
  updateNavBar();
}

document.getElementById("signout-btn")?.addEventListener("click", () => {
  removeToken(); // Remove the user's access token
  alert("You have been logged out!");
});
