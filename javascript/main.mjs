import { initializeNavbar, getUsername, getToken } from "./auth.mjs";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize navbar  (login/logout buttons)
  initializeNavbar();
  if (navbarMessage) {
    const username = getUsername();
    if (username) {
      navbarMessage.textContent = `Hi, ${username}`;
    } else {
      navbarMessage.textContent = "Hi, Guest";
    }
  }
  // hamburger toggle
  const toggleButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggleButton && navLinks) {
    toggleButton.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const blogFeed = document.getElementById("blogFeed");

  if (!blogFeed) {
    console.error("Blog feed container not found.");
    return;
  }
  const username = getUsername();
  const token = getToken();
  const apiUrl = `https://v2.api.noroff.dev/blog/posts/${username}`; // Verify this endpoint

  console.log("Fetching posts from:", apiUrl); // Log the API URL for debugging

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`, // Ensure the token is valid
      },
    });

    if (response.ok) {
      const result = await response.json();
      const posts = Array.isArray(result.data) ? result.data : [];

      // Sort posts by creation date in a descending order
      const sortedPosts = posts.sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      );

      // Gets the 12 latest posts
      const latestPosts = sortedPosts.slice(0, 12);

      // Generate HTML for the blog feed
      blogFeed.innerHTML = latestPosts
        .map(
          (post) => `
          <div class="blog-thumbnail">
            <a href="/post/index.html?id=${post.id}">
              <img src="${
                post.media?.url ||
                "https://img.freepik.com/free-psd/3d-rendering-interface-icon_23-2151553990.jpg?ga=GA1.1.1116145374.1744922010&semt=ais_hybrid&w=740"
              }" alt="${post.media?.alt || "Blog Thumbnail"}" />
              <h3>${post.title}</h3>
            </a>
          </div>
        `
        )
        .join("");
    } else {
      console.error(
        "Failed to fetch posts from the API. Status:",
        response.status
      );
      blogFeed.innerHTML = `<p>Unable to load blog posts. Please try again later.</p>`;
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    blogFeed.innerHTML = `<p>Unable to load blog posts. Please try again later.</p>`;
  }
});