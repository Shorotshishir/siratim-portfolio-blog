import Link from "next/link";
import { formatDate, getBlogPosts } from "app/blog/utils";
import TagLink from "./tag";

type BlogPostsProps = {
  filterByTag?: string;
};

export function BlogPosts({ filterByTag }: BlogPostsProps) {
  let allBlogs = getBlogPosts();

  if (filterByTag) {
    allBlogs = allBlogs.filter((post) =>
      post.metadata.tags?.includes(filterByTag)
    );
  }

  return (
    <div>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1;
          }
          return 1;
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              <div>
                <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {post.metadata.title}
                </p>
                {post.metadata.tags && Array.isArray(post.metadata.tags) && (
                  <div className="flex gap-2 mt-1">
                    {post.metadata.tags.map((tag) => (
                      <TagLink key={tag} tag={tag} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}
