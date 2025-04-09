// fetch these amazing codes https://v2.api.noroff.dev/blog/posts/<name>
import { createHTML } from "./utils.mjs";

export function createPostElement(post) {
  const html = `
    <div class="post">
      <h2>${post.title}</h2>
      <p>${
        post.body.length > 200 ? post.body.slice(0, 200) + "..." : post.body
      }</p>
      <span>By: ${post.author.name}</span>
      <p>Tags: ${post.tags.join(", ")}</p>
      ${
        post.media && post.media.url
          ? `<img src="${post.media.url}" alt="${
              post.media.alt || "Post Image"
            }">`
          : ""
      }
    </div>
  `;
  return createHTML(html);
}
export async function fetchBlogPosts() {
  const username = "IceFeather";
  const url = `https://v2.api.noroff.dev/blog/posts/${username}`;
  console.log("Fetching from:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Blog posts:", data);

    data.data.forEach((post) => {
      console.log(`Title: ${post.title}`);
      console.log(`ID: ${post.id}`);
      console.log("===");
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }
}
export function createHTML(template) {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(template, "text/html");
  return parsedDocument.body.firstChild;
}
export function clearNode(el) {
  el.innerHTML = "";
}
// console.log(fetchBlogPosts)
