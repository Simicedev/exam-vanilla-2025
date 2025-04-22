import { getToken, getUsername } from "./auth.mjs";

async function fetchPostData() {
  const token = getToken();
  const username = getUsername();

  if (!token || !username) {
    alert("You must be logged in to edit posts.");
    window.location.href = "/account/login.html";
    return;
  }

  const postId = new URLSearchParams(window.location.search).get("id");
  if (!postId) {
    document.getElementById("noPostMessage").style.display = "block";
    return;
  }

  const apiUrl = `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const post = await response.json();
      populateEditForm(post.data);
    } else {
      const localPost = getLocalPost(postId);
      if (localPost) {
        populateEditForm(localPost);
      } else {
        alert("Post not found.");
        window.location.href = "/index.html";
      }
    }
  } catch (error) {
    console.error("Error fetching post data:", error);
    alert("Error fetching post data. Redirecting to home page.");
    window.location.href = "/index.html";
  }
}

// Populate the edit form with the post data
function populateEditForm(post) {
  document.getElementById("title").value = post.title || "";
  document.getElementById("body").value = post.body || "";
  document.getElementById("tags").value = (post.tags || []).join(", ");
  document.getElementById("image").value = post.media?.url || "";
  document.getElementById("imageAlt").value = post.media?.alt || "";

  // Display the created date if available
  const createdDateElement = document.getElementById("createdDate");
  if (createdDateElement) {
    createdDateElement.textContent = `Created on: ${
      post.created ? new Date(post.created).toLocaleString() : "Unknown"
    }`;
  }

  document.getElementById("editContainer").style.display = "block";
  document.getElementById("noPostMessage").style.display = "none";
}

// Retrieve a post from localStorage
function getLocalPost(postId) {
  const posts = JSON.parse(localStorage.getItem("userPosts")) || [];
  return posts.find((post) => post.id === postId);
}

// Load all posts for the user and display them in a list
function loadAllPosts() {
  const posts = JSON.parse(localStorage.getItem("userPosts")) || [];
  const postListContainer = document.getElementById("postList");

  if (!postListContainer) {
    console.error("Element with id 'postList' not found in the DOM.");
    return;
  }

  if (posts.length === 0) {
    postListContainer.innerHTML = "<p>No posts available.</p>";
    return;
  }

  // Render the list of posts
  postListContainer.innerHTML = posts
    .map(
      (post) => `
      <div class="post-item">
        <h3>${post.title}</h3>
        <p>${post.body.substring(0, 100)}...</p>
        <button class="edit-btn" data-id="${post.id}">Edit</button>
      </div>
    `
    )
    .join("");

  // Add event listeners to the edit buttons
  const editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent any default behavior
      const postId = button.dataset.id;
      window.location.href = `/post/edit.html?id=${postId}`;
    });
  });
}


// Handle form submission for updating a post
document
  .getElementById("editPostForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = getToken();
    const username = getUsername();
    const postId = new URLSearchParams(window.location.search).get("id");
    const apiUrl = `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`;

    const title = document.getElementById("title").value.trim();
    const body = document.getElementById("body").value.trim();
    const tagsInput = document.getElementById("tags").value.trim();
    const imageUrl = document.getElementById("image").value.trim();
    const imageAlt = document.getElementById("imageAlt").value.trim();

    if (!title || !body) {
      alert("Title and content are required.");
      return;
    }

    // Validate the image URL if provided
    const isValidUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    if (imageUrl && !isValidUrl(imageUrl)) {
      alert("The Image URL is invalid. Please provide a valid URL.");
      return;
    }

    const updatedPost = {
      title,
      body,
      tags: tagsInput ? tagsInput.split(",").map((t) => t.trim()) : [],
      media: {},
    };

    // Add media.url only if imageUrl is provided
    if (imageUrl) {
      updatedPost.media.url = imageUrl;
    }

    // Always include media.alt
    updatedPost.media.alt = imageAlt || "No description provided";

    console.log("Image URL:", imageUrl);
    console.log("Updated Post Payload:", updatedPost);

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPost),
      });

      const result = await response.json();

      if (response.ok) {
        updateLocalPost(postId, result.data);
        alert("Post updated successfully!");
        window.location.href = `/post/index.html?id=${postId}`;
      } else {
        throw new Error(
          result.errors?.[0]?.message || "Failed to update post."
        );
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Error: " + error.message);
    }
  });

// Update a post in localStorage
function updateLocalPost(postId, updatedPost) {
  const posts = JSON.parse(localStorage.getItem("userPosts")) || [];
  const updatedPosts = posts.map((post) =>
    post.id === postId
      ? { ...post, ...updatedPost, created: post.created } // Preserve the created date
      : post
  );
  localStorage.setItem("userPosts", JSON.stringify(updatedPosts));
}

// Call the appropriate function when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const postId = new URLSearchParams(window.location.search).get("id");

  if (postId) {
    // Fetch the post data if an ID is present in the URL
    fetchPostData();
  } else {
    // If no ID is present, show the list of posts
    loadAllPosts();
  }
});
// Handle post deletion
document
  .getElementById("deletePostBtn")
  .addEventListener("click", async function () {
    const token = getToken();
    const username = getUsername();
    const postId = new URLSearchParams(window.location.search).get("id");
    const apiUrl = `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`;

    if (!postId) {
      alert("No post ID found. Cannot delete the post.");
      return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove the post from localStorage
        deleteLocalPost(postId);

        alert("Post deleted successfully!");
        // Redirect to the post overview page
        window.location.href = `/post/edit.html`; // Corrected URL
      } else {
        const result = await response.json();
        throw new Error(
          result.errors?.[0]?.message || "Failed to delete post."
        );
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error: " + error.message);
    }
  });

// Remove a post from localStorage
function deleteLocalPost(postId) {
  const posts = JSON.parse(localStorage.getItem("userPosts")) || [];
  const updatedPosts = posts.filter((post) => post.id !== postId);
  localStorage.setItem("userPosts", JSON.stringify(updatedPosts));
}
