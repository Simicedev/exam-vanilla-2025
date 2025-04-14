import { initializeNavbar } from "./auth.mjs";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize navbar  (login/logout buttons)
  initializeNavbar();

  // hamburger toggle
  const toggleButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggleButton && navLinks) {
    toggleButton.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }
});
