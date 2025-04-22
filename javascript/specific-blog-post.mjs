// Fetch and display the blog post
async function fetchBlogPost() {
  const postId = new URLSearchParams(window.location.search).get("id");
  if (!postId) {
    document.getElementById("blogPost").innerHTML =
      "<p>Post not found. Please go back to the homepage.</p>";
    return;
  }

  const posts = JSON.parse(localStorage.getItem("userPosts")) || [];
  const post = posts.find((p) => p.id === postId);

  if (post) {
    displayBlogPost(post);
  } else {
    document.getElementById("blogPost").innerHTML =
      "<p>Post not found. Please go back to the homepage.</p>";
  }
}

// Display the blog post content
function displayBlogPost(post) {
  const blogPost = document.getElementById("blogPost");
  blogPost.innerHTML = `
    <h1>${post.title}</h1>
    <p>${post.body}</p>
    <p><strong>Tags:</strong> ${post.tags.join(", ")}</p>
    ${
      post.media?.url
        ? `<img src="${post.media.url}" alt="${post.media.alt}" />`
        : ""
    }
  `;
}

// Initialize the blog post page
document.addEventListener("DOMContentLoaded", () => {
  fetchBlogPost();
});