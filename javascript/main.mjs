import { initializeNavbar, getUsername, getToken } from "./auth.mjs";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize navbar
  initializeNavbar();
  const navbarMessage = document.getElementById("navbarMessage");
  if (navbarMessage) {
    const username = getUsername();
    if (username) {
      navbarMessage.textContent = `Welcome, ${username}!`;
    } else {
      navbarMessage.textContent = "Hi, Guest";
    }
  }

  // Hamburger toggle
  const toggleButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggleButton && navLinks) {
    toggleButton.addEventListener("click", () => {
      navLinks.classList.toggle("show");
      if (navLinks.classList.contains("show")) {
        if (navbarMessage) navbarMessage.style.display = "none";
      } else {
        if (navbarMessage) navbarMessage.style.display = "block";
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const blogFeed = document.getElementById("blogFeed");
  if (!blogFeed) {
    if (window.location.pathname === "/index.html") {
      console.error("Blog feed container not found.");
    }
    return;
  }
  const searchInput = document.getElementById("searchInput");
  const filterDropdown = document.getElementById("filterDropdown");
  const sortDropdown = document.getElementById("sortDropdown");
  let allPosts = [];

  const username = getUsername();
  const token = getToken();
  const apiUrl = `https://v2.api.noroff.dev/blog/posts/${username}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const result = await response.json();
      allPosts = Array.isArray(result.data) ? result.data : [];

      // Render the initial blog feed
      generateBlogFeed(allPosts);

      // Event listeners for search, filter, and sort
      if (searchInput) {
        searchInput.addEventListener("input", handleSearchFilterSort);
      }
      if (filterDropdown) {
        filterDropdown.addEventListener("change", handleSearchFilterSort);
      }
      if (sortDropdown) {
        sortDropdown.addEventListener("change", handleSearchFilterSort);
      }
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

  // Generate the blog feed thumbnails
  function generateBlogFeed(posts) {
    if (!posts || posts.length === 0) {
      blogFeed.innerHTML = `
      <div class="carousel-message">
        <p>Create a new post to get started! All your posts will be displayed right here in your personal blog feed!</p>
        <a href="/post/create.html" class="create-post-btn">Create Post</a>
      </div>
    `;
      return;
    }

    blogFeed.innerHTML = posts
      .map(
        (post) => `
        <div class="blog-thumbnail">
          <a href="/post/index.html?id=${post.id}">
            <img src="${post.media?.url}" alt="${
          post.media?.alt || "Blog Thumbnail"
        }" />
            <h3>${post.title}</h3>
          </a>
        </div>
      `
      )
      .join("");
  }

  function handleSearchFilterSort() {
    const query = searchInput?.value.toLowerCase() || "";
    const selectedTag = filterDropdown?.value || "";
    const sortOption = sortDropdown?.value || "";

    // Filtering posts by search query and selected tag
    let filteredPosts = allPosts.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(query);
      const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });

    if (sortOption === "name-asc") {
      filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "name-desc") {
      filteredPosts.sort((a, b) => b.title.localeCompare(a.title));
    }

    // Render the filtered and sorted posts
    generateBlogFeed(filteredPosts);
  }
});

// code for animation on carousel
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".carousel-container");
  if (!carousel) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          carousel.classList.add("visible");
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(carousel);

  // Carousel navigation logic (only if carousel exists)
  const carouselItems = document.querySelector(".carousel-items");
  const slides = document.querySelectorAll(".carousel-item");
  let currentSlide = 0;

  function updateCarousel() {
    if (carouselItems) {
      carouselItems.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
  }

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentSlide > 0) {
        currentSlide--;
        updateCarousel();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentSlide < slides.length - 1) {
        currentSlide++;
        updateCarousel();
      }
    });
  }

  // Keyboard arrow support (only if carousel is present)
  if (prevBtn && nextBtn) {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        prevBtn.click();
      } else if (e.key === "ArrowRight") {
        nextBtn.click();
      }
    });
  }
});
