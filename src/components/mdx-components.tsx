import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Image from "next/image";
import Link from "next/link";

interface LinkProps {
  href?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

interface MDXContentProps {
  source: MDXRemoteSerializeResult;
}

const components = {
  Image,
  a: ({ href, children, ...props }: LinkProps) => {
    if (href?.startsWith("/")) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }
    if (href?.startsWith("#")) {
      return <a href={href} {...props}>{children}</a>;
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
};

export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <MDXRemote {...source} components={components} />
    </div>
  );
}