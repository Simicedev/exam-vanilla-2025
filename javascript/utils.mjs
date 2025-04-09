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
    return data.data; // <-- return the posts
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export function clearNode(el) {
  el.innerHTML = "";
}

export function createHTML(template) {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(template, "text/html");
  return parsedDocument.body.firstChild;
}
