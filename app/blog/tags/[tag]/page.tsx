import type { Metadata } from "next";
import { getAllTags, getPostsByTagSlug } from "app/blog/utils";
import { BlogPosts } from "app/components/posts";
import { notFound } from "next/navigation";

type TagPageProps = {
  params: Promise<{
    tag: string;
  }>;
};

export async function generateStaticParams() {
  return Array.from(getAllTags().keys()).map((tag) => ({
    tag,
  }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const tagName = getAllTags().get(tag) ?? tag;

  return {
    title: `Posts tagged with "${tagName}"`,
    description: `All blog posts tagged with "${tagName}"`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = getPostsByTagSlug(tag);
  const tagName = getAllTags().get(tag) ?? tag;

  if (posts.length === 0) {
    notFound();
  }

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
        Posts tagged with &quot;{tagName}&quot;
      </h1>
      <BlogPosts filterByTag={tagName} />
    </section>
  );
}
