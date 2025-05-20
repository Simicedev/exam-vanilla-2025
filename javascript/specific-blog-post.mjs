import { getToken, getUsername } from "./auth.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  const blogPostContainer = document.getElementById("blogPostContainer");

  if (!blogPostContainer) {
    console.error("Blog post container not found.");
    return;
  }

  // Get the post ID from the URL query string
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");

  if (!postId) {
    blogPostContainer.innerHTML = `<p>Post not found. Please check the URL.</p>`;
    return;
  }

  const token = getToken();
  const username = getUsername();
  const apiUrl = `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const postResponse = await response.json();
      console.log("Fetched Post Data:", postResponse); // Debug the API response

      // Accessing the post data
      const post = postResponse.data;

      // Render the blog post
      blogPostContainer.innerHTML = `
        <div class="blog-post">
          <h1>${post.title || "Untitled Post"}</h1>
          <p class="blog-meta">
            By <strong>${post.author?.name || "Unknown Author"}</strong> on ${
        post.created
          ? new Date(post.created).toLocaleDateString()
          : "Unknown Date"
      }
          </p>
          <div class="blog-banner">
            <img src="${
              post.media?.url ||
              "https://img.freepik.com/free-vector/login-concept-illustration_114360-739.jpg?ga=GA1.1.1116145374.1744922010&semt=ais_hybrid&w=740"
            }" alt="${post.media?.alt || "Blog Banner"}" />
          </div>
          <div class="blog-content">
            ${post.body || "No content available for this post."}
          </div>
          <div class="blog-author">
            <img src="${
              post.author?.avatar?.url || "/images/avatar-placeholder.jpg"
            }" alt="${
        post.author?.avatar?.alt || "Author Avatar"
      }" class="author-avatar" />
            <p><strong>${post.author?.name || "Unknown Author"}</strong></p>
            <p>${post.author?.bio || "No bio available."}</p>
          </div>
          <div class="blog-share">
            <button id="shareButton" aria-label="Share this post">
              <box-icon name="share-alt" color="#fff"></box-icon> Share
            </button>
          </div>
        </div>
      `;

      // Add share functionality
      const shareButton = document.getElementById("shareButton");
      shareButton.addEventListener("click", () => {
        const shareUrl = `${window.location.origin}/post/index.html?id=${postId}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert("Post URL copied to clipboard!");
        });
      });
    } else {
      blogPostContainer.innerHTML = `<p>Unable to load the post. Please try again later.</p>`;
    }
  } catch (error) {
    console.error("Error fetching the post:", error);
    blogPostContainer.innerHTML = `<p>Unable to load the post. Please try again later.</p>`;
  }
});
