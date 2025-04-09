import { fetchBlogPosts, clearNode, createHTML, } from "./utils.mjs";

fetchBlogPosts();
export function renderBlogPosts(posts) {
  const postsContainer = document.getElementById("posts-container");
  clearNode(postsContainer);

  posts.forEach((post) => {
    const postElement = createPostElement(post);
    postsContainer.appendChild(postElement);
  });
}

function createPostElement(post) {
  const postDiv = document.createElement("div");
  postDiv.classList.add("post");

  const title = document.createElement("h2");
  title.textContent = post.title;

  const body = document.createElement("p");
  body.textContent =
    post.body.length > 200 ? post.body.slice(0, 200) + "..." : post.body;

  const author = document.createElement("span");
  author.textContent = `By: ${post.author.name}`;

  const tags = document.createElement("p");
  tags.textContent = `Tags: ${post.tags.join(", ")}`;

  postDiv.appendChild(title);
  postDiv.appendChild(body);
  postDiv.appendChild(author);
  postDiv.appendChild(tags);

  if (post.media && post.media.url) {
    const img = document.createElement("img");
    img.src = post.media.url;
    img.alt = post.media.alt || "Post Image";
    postDiv.appendChild(img);
  }

  return postDiv;
}