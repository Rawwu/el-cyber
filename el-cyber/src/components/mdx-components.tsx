import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Image from "next/image";
import Link from "next/link";

const components = {
  Image,
  a: ({ href, children, ...props }: any) => {
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

interface MDXContentProps {
  source: MDXRemoteSerializeResult;
}

export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <MDXRemote {...source} components={components} />
    </div>
  );
}