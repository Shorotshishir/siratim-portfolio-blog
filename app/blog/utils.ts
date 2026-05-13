import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";

const metadataSchema = z.object({
  title: z.string().min(1),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  summary: z.string().min(1),
  image: z.string().optional(),
  tags: z.array(z.string().min(1)).optional(),
});

export type Metadata = z.infer<typeof metadataSchema>;

export type MDXEntry = {
  metadata: Metadata;
  slug: string;
  content: string;
};

const blogPostsDirectory = path.join(process.cwd(), "app", "blog", "posts");
const portfolioDirectory = path.join(process.cwd(), "app", "portfolio", "folio");

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(rawContent);
  const result = metadataSchema.safeParse(parsed.data);

  if (!result.success) {
    const relativePath = path.relative(process.cwd(), filePath);
    throw new Error(
      `Invalid MDX metadata in ${relativePath}: ${result.error.message}`
    );
  }

  return {
    metadata: result.data,
    content: parsed.content.trim(),
  };
}

function getMDXData(dir: string): MDXEntry[] {
  return getMDXFiles(dir).map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function sortPosts(posts: MDXEntry[]) {
  return [...posts].sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  );
}

export function getBlogPosts() {
  return sortPosts(getMDXData(blogPostsDirectory));
}

export function getPortfolio() {
  return getMDXData(portfolioDirectory);
}

export function getTagSlug(tag: string) {
  return encodeURIComponent(tag.trim().toLowerCase().replace(/\s+/g, "-"));
}

export function getAllTags() {
  const tags = new Map<string, string>();

  for (const post of getBlogPosts()) {
    for (const tag of post.metadata.tags ?? []) {
      tags.set(getTagSlug(tag), tag);
    }
  }

  return tags;
}

export function getPostsByTagSlug(tagSlug: string) {
  return getBlogPosts().filter((post) =>
    post.metadata.tags?.some((tag) => getTagSlug(tag) === tagSlug)
  );
}

export function formatDate(date: string, includeRelative = false) {
  const targetDate = new Date(`${date}T00:00:00`);
  const fullDate = targetDate.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  const currentDate = new Date();
  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  const daysAgo = currentDate.getDate() - targetDate.getDate();

  if (yearsAgo > 0) {
    return `${fullDate} (${yearsAgo}y ago)`;
  }

  if (monthsAgo > 0) {
    return `${fullDate} (${monthsAgo}mo ago)`;
  }

  if (daysAgo > 0) {
    return `${fullDate} (${daysAgo}d ago)`;
  }

  return `${fullDate} (Today)`;
}
