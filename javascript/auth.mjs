
// Save token
export function saveToken(token) {
  localStorage.setItem("accessToken", token);
}

// Get token
export function getToken() {
  return localStorage.getItem("accessToken");
}

// Remove token
export function removeToken() {
  localStorage.removeItem("accessToken");
  window.location.href = "login.html";
}

// Check if the user is logged in
export function isLoggedIn() {
  return getToken() !== null;  // If there's a token, the user is logged in
}


export function updateNavBar() {
  const isLoggedInState = isLoggedIn();
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const signOutLink = document.getElementById('signout-link');

  if (isLoggedInState) {
    loginLink.style.display = 'none';
    registerLink.style.display = 'none';
    signOutLink.style.display = 'inline';
  } else {
    loginLink.style.display = 'inline';
    registerLink.style.display = 'inline';
    signOutLink.style.display = 'none';
  }
}

// Call function when the page loads
export function initializeNavbar() {
  updateNavBar();
}

document.getElementById("signout-btn")?.addEventListener("click", () => {
  removeToken(); // Remove the user's access token
  alert("You have been logged out!");
  window.location.href = "index.html";
});

