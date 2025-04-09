
// Save token
export function saveToken(token) {
  localStorage.setItem("accessToken", token);
}

// Get token
export function getToken() {
  return localStorage.getItem("accessToken");
}

// Remove token
export function logout() {
  localStorage.removeItem("accessToken");
  window.location.href = "/account/login.html";
}




