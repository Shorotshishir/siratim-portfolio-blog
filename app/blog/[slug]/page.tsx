import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CustomMDX } from "app/components/mdx";
import { formatDate, getBlogPosts } from "app/blog/utils";
import { baseUrl, siteConfig } from "app/config";
import TagLink from "app/components/tag";

type BlogPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const getReadTime = (content: string, wordCount = 200): string => {
  const trimmed = content.trim();
  if (trimmed.length === 0) {
    return "Empty";
  }

  const words = trimmed.split(/\s+/);
  const time = words.length / wordCount;
  if (time < 1) {
    return "less than a minute read";
  }

  const roundedTime = Math.ceil(time);
  return `${roundedTime} minute${roundedTime > 1 ? "s" : ""} read`;
};

export async function generateStaticParams() {
  const posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata | undefined> {
  const { slug } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug);
  if (!post) {
    return;
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  const ogImage = image
    ? `${baseUrl}${image}`
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `${baseUrl}/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: siteConfig.author.name,
            },
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {post.metadata.title}
      </h1>
      <div className="flex flex-col gap-2 mt-2 mb-8">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Published {formatDate(post.metadata.publishedAt)} ·{" "}
          {getReadTime(post.content)}
        </p>
        {post.metadata.tags && (
          <div className="flex flex-wrap gap-2">
            {post.metadata.tags.map((tag) => (
              <TagLink key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
    </section>
  );
}
