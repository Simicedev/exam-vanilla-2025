import { getToken, getUsername } from "./auth.mjs";
document.addEventListener("DOMContentLoaded", () => {
  // Populate the carousel with blog posts
  function populateCarousel(posts) {
    const carouselItems = document.getElementById("carouselItems");
    if (!carouselItems) {
      console.error("Carousel items container not found in the DOM.");
      return;
    }

    // Ensure posts is an array
    if (!Array.isArray(posts)) {
      console.error("Invalid posts data. Expected an array.");
      carouselItems.innerHTML = `<p>No posts available. Create a new post to get started!</p>`;
      return;
    }

    if (posts.length === 0) {
      carouselItems.innerHTML = `<p>No posts available. Create a new post to get started!</p>`;
      return;
    }

    // Sort posts by creation date in descending order (most recent first)
    const sortedPosts = posts.sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );
    console.log("Sorted Posts:", sortedPosts);

    // Get the 3 most recent posts
    const recentPosts = sortedPosts.slice(0, 3); // Take the first 3 posts
    console.log("Recent Posts:", recentPosts);

    carouselItems.innerHTML = recentPosts
      .map(
        (post) => `
      <div class="carousel-item">
        <h3>${post.title}</h3>
        <p>${post.body.substring(0, 100)}...</p>
        <a href="/post/index.html?id=${
          post.id
        }" class="view-post-btn">Read More</a>
      </div>
    `
      )
      .join("");
  }

async function fetchCarouselPosts() {
  const token = getToken();
  const username = getUsername();
  const apiUrl = `https://v2.api.noroff.dev/blog/posts/${username}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const result = await response.json();

      // Log the API response to inspect its structure
      console.log("API Response:", result);

      // Ensure the API response contains an array
      const posts = Array.isArray(result.data) ? result.data : [];
      if (!Array.isArray(posts)) {
        throw new Error("API response is not an array.");
      }

      localStorage.setItem("userPosts", JSON.stringify(posts)); // Update local cache
      populateCarousel(posts);
    } else {
      console.error("Failed to fetch posts from the API.");
      populateCarousel([]); // Show empty carousel
    }
  } catch (error) {
    console.error("Error fetching posts:", error);

    // Fallback to localStorage
    const cachedPosts = JSON.parse(localStorage.getItem("userPosts")) || [];
    populateCarousel(cachedPosts);
  }
}

  // Carousel navigation
  let currentIndex = 0;

  function showCarouselItem(index) {
    const carouselItems = document.getElementById("carouselItems");
    if (!carouselItems || carouselItems.children.length === 0) {
      console.error("Carousel items container not found or empty.");
      return;
    }
    const totalItems = carouselItems.children.length;
    currentIndex = (index + totalItems) % totalItems; // Wrap around
    carouselItems.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      showCarouselItem(currentIndex - 1);
    });

    nextBtn.addEventListener("click", () => {
      showCarouselItem(currentIndex + 1);
    });
  } else {
    console.error("Carousel navigation buttons not found.");
  }

  // Initialize the carousel
  fetchCarouselPosts();
});
