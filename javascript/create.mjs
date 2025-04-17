import { getToken, getUsername } from "./auth.mjs";

const form = document.getElementById("createPostForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("Form submitted!");

  const token = getToken();
  const profileName = getUsername();

  if (!token || !profileName) {
    alert("You must be logged in to create a post.");
    window.location.href = "/account/login.html";
    return;
  }

  const title = form.title.value.trim();
  const body = form.body.value.trim();
  const tagsInput = form.tags.value.trim();
  const created = form.releaseDate.value;
  const imageUrl = form.imageUrl.value.trim();
  const imageAlt = form.imageAlt.value.trim();

  const tags = tagsInput ? tagsInput.split(",").map((tag) => tag.trim()) : [];

  // Construct the payload
  const payload = {
    title,
    body,
    tags,
    created: created || new Date().toISOString(),
  };

  // Add the media object only if imageUrl is provided
  if (imageUrl) {
    payload.media = {
      url: imageUrl,
      alt: imageAlt || "Image", // Default alt text if none is provided
    };
  }

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/${profileName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const postData = await response.json();
    console.log("Created Post Data:", postData);

    if (!response.ok) {
      throw new Error(
        postData.errors?.[0]?.message || "Failed to create post."
      );
    }

    const postId = postData.data?.id;

    if (!postId) {
      throw new Error("Post created but no ID was returned from API.");
    }

    // Save the post locally
    savePostLocally(postData.data);

    alert("Post created successfully!");
    window.location.href = `/post/edit.html`;
  } catch (error) {
    console.error("Error creating post:", error);
    alert("Error creating post: " + error.message);
  }
});

// Save post to localStorage
function savePostLocally(post) {
  const posts = JSON.parse(localStorage.getItem("userPosts")) || [];
  posts.push(post);
  localStorage.setItem("userPosts", JSON.stringify(posts));
}
