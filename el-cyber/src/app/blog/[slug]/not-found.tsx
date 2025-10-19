import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
      <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
      <p className="text-[rgb(var(--color-muted-foreground))] text-lg mb-8">
        Sorry, we couldn't find the blog post you're looking for.
      </p>
      <Link
        href="/blog"
        className="text-[rgb(var(--color-primary))] hover:underline font-medium"
      >
        ← Back to all posts
      </Link>
    </div>
  );
}