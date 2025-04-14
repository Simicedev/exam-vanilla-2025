import { getToken, getUsername } from "./auth.mjs";

async function fetchPostData() {
  const token = getToken();
  const username = getUsername();
  if (!token || !username) {
    window.location.href = "/account/login.html";
    return;
  }

  const postId = new URLSearchParams(window.location.search).get("id");
  const apiUrl = `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`;

  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const post = await response.json();

    // Checks if youre the Author
    if (post.author !== username) {
      alert("You are not authorized to edit this post.");
      window.location.href = "/index.html"; // Redirect to home if unauthorized
      return;
    }

    document.getElementById("title").value = post.title;
    document.getElementById("body").value = post.body;
    document.getElementById("image").value = post.image;
  } else {
    alert("No post found or unauthorized access. Back to home page you go!");
    window.location.href = "/index.html"; // Redirect to home if post not found
  }
}

document
  .getElementById("editPostForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    const token = getToken();
    const username = getUsername();
    const postId = new URLSearchParams(window.location.search).get("id");
    const apiUrl = `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`;

    const updatedPost = {
      title: document.getElementById("title").value,
      body: document.getElementById("body").value,
      image: document.getElementById("image").value,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "PUT", // <- UPDATE method
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPost),
      });

      if (response.ok) {
        alert("Post updated successfully!");
        window.location.href = `/post/index.html?id=${postId}`; // Redirect to the updated post
      } else {
        alert("Failed to update post. Please try again.");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Something went wrong while updating. Check the console.");
    }
  });
// Here are event listener for delete post button

document
  .getElementById("deletePostBtn")
  .addEventListener("click", async function () {
    const token = getToken();
    const username = getUsername();
    const postId = new URLSearchParams(window.location.search).get("id");
    const apiUrl = `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`;

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      alert("Post deleted successfully!");
      window.location.href = "/index.html"; // Redirect home, nothing see here anymore
    } else {
      alert("Failed to delete post. Maybe try again?");
    }
  });

fetchPostData();
