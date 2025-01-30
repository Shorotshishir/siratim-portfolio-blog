import { getBlogPosts } from "app/blog/utils";
import { BlogPosts } from "app/components/posts";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = getBlogPosts();
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.metadata.tags?.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).map((tag) => ({
    tag: tag,
  }));
}

export function generateMetadata({ params }) {
  return {
    title: `Posts tagged with "${params.tag}"`,
    description: `All blog posts tagged with "${params.tag}"`,
  };
}

export default function TagPage({ params }) {
  const posts = getBlogPosts().filter((post) =>
    post.metadata.tags?.includes(params.tag)
  );

  if (posts.length === 0) {
    notFound();
  }

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
        Posts tagged with "{params.tag}"
      </h1>
      <BlogPosts filterByTag={params.tag} />
    </section>
  );
}
