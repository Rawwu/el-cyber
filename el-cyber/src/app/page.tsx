import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to El Cyber</h1>
        <p className="text-xl text-[rgb(var(--color-muted-foreground))]">
          Weaving Networks || Tejiendo Redes
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8">Latest Posts</h2>
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border-b border-[rgb(var(--color-border))] pb-8 last:border-b-0"
            >
              <Link href={`/blog/${post.slug}`}>
                <h3 className="text-2xl font-semibold mb-2 transition-colors hover:text-[rgb(var(--color-primary))]">
                  {post.title}
                </h3>
              </Link>
              <p className="text-sm text-[rgb(var(--color-muted-foreground))] mb-3">
                {formatDate(post.date)}
              </p>
              <p className="text-[rgb(var(--color-muted-foreground))] mb-4">
                {post.description}
              </p>
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-[rgb(var(--color-muted))] rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
        {posts.length > 0 && (
          <div className="mt-8">
            <Link
              href="/blog"
              className="text-[rgb(var(--color-primary))] hover:underline font-medium"
            >
              View all posts →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}