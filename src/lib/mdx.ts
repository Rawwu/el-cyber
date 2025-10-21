import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content');

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  published: boolean;
  content: string;
}

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory).filter(file => file.endsWith('.mdx'));
}

export function getPostBySlug(slug: string): Post {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    content,
    title: data.title,
    date: data.date,
    description: data.description,
    tags: data.tags || [],
    published: data.published ?? true,
  };
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter(post => post.published)
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}