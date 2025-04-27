import { getToken, getUsername } from "./auth.mjs";
document.addEventListener("DOMContentLoaded", () => {
  // Populate the carousel with blog posts
  function AddToCarousel(posts) {
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

    const sortedPosts = posts.sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );
    // console.log("Sorted Posts:", sortedPosts);

    // 3 most recent posts
    const recentPosts = sortedPosts.slice(0, 3);
    // console.log("Recent Posts:", recentPosts);

    carouselItems.innerHTML = recentPosts
      .map(
        (post) => `
      <div class="carousel-item">
        <img src="${
          post.media?.url ||
          "https://img.freepik.com/free-vector/login-concept-illustration_114360-739.jpg?ga=GA1.1.1116145374.1744922010&semt=ais_hybrid&w=740"
        }" alt="${post.media?.alt || ""}" class="carousel-image" />
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
      // console.log("API Response:", result);

      // Ensure the API response contains an array
      const posts = Array.isArray(result.data) ? result.data : [];
      if (!Array.isArray(posts)) {
        throw new Error("API response is not an array.");
      }

      localStorage.setItem("userPosts", JSON.stringify(posts));
      AddToCarousel(posts);
    } else {
      console.error("Failed to fetch posts from the API.");
      AddToCarousel([]); // Show empty carousel
    }
  } catch (error) {
    console.error("Error fetching posts:", error);

    // Fallback to localStorage
    const cachedPosts = JSON.parse(localStorage.getItem("userPosts")) || [];
    AddToCarousel(cachedPosts);
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
