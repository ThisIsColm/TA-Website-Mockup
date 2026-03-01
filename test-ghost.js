const { config } = require('./src/lib/config');

async function test() {
  const url = new URL(`${config.ghost.url}/ghost/api/content/posts/`);
  url.searchParams.set("key", config.ghost.contentApiKey);
  url.searchParams.set("limit", "1");
  url.searchParams.set("include", "tags");

  const res = await fetch(url.toString());
  const data = await res.json();
  const post = data.posts[0];
  
  console.log("Raw Post:", post);
  console.log("Date:", post.published_at);
  
  // Test adapter logic
  const adapted = {
    slug: post.slug,
    title: post.title,
    excerpt: post.custom_excerpt || post.excerpt || "",
    date: post.published_at,
    author: "Tiny Ark",
    coverImage: post.feature_image || "",
    category: post.primary_tag?.name || post.tags?.[0]?.name || "Case Study"
  };
  
  console.log("Adapted:", adapted);
}
test();
