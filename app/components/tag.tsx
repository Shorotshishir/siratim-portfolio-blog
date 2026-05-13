import Link from "next/link";
import { getTagSlug } from "app/blog/utils";

export default function TagLink({ tag }: { tag: string }) {
  return (
    <Link
      href={`/blog/tags/${getTagSlug(tag)}`}
      className="text-sm text-red-200 dark:text-red-200 hover:text-red-700 dark:hover:text-red-500"
    >
      #{tag}
    </Link>
  );
}
