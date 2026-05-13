import { getAllTags, getBlogPosts } from "app/blog/utils";
import { baseUrl } from "app/config";

export default async function sitemap() {
  const blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  const tags = Array.from(getAllTags().keys()).map((tag) => ({
    url: `${baseUrl}/blog/tags/${tag}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  const routes = ["", "/blog"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...blogs, ...tags];
}
