import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "El Cyber",
  description: "Read my latest blog posts about technology, development, and more.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">All Posts</h1>
        <p className="text-xl text-[rgb(var(--color-muted-foreground))]">
          {posts.length} {posts.length === 1 ? "post" : "posts"} about tech, coding, and life.
        </p>
      </div>

      <div className="space-y-12">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="border-b border-[rgb(var(--color-border))] pb-12 last:border-b-0"
          >
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-3xl font-bold mb-3 transition-colors hover:text-[rgb(var(--color-primary))]">
                {post.title}
              </h2>
            </Link>
            <div className="flex items-center gap-4 text-sm text-[rgb(var(--color-muted-foreground))] mb-4">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {post.tags.length > 0 && (
                <>
                  <span>•</span>
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-[rgb(var(--color-muted))] rounded-md text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
            <p className="text-[rgb(var(--color-muted-foreground))] text-lg mb-4">
              {post.description}
            </p>
            <Link
              href={`/blog/${post.slug}`}
              className="text-[rgb(var(--color-primary))] hover:underline font-medium inline-flex items-center"
            >
              Read more →
            </Link>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[rgb(var(--color-muted-foreground))] text-lg">
            No posts yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}