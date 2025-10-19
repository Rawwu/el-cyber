"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

interface Comment {
  id: string;
  name: string;
  comment: string;
  createdAt: string;
}

interface CommentListProps {
  postSlug: string;
  refreshTrigger?: number;
}

export function CommentList({ postSlug, refreshTrigger }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/comments?postSlug=${postSlug}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        
        const data = await response.json();
        setComments(data);
      } catch (err) {
        setError("Failed to load comments");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postSlug, refreshTrigger]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-[rgb(var(--color-muted-foreground))]">Loading comments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[rgb(var(--color-muted-foreground))]">
          No comments yet. Be the first to share your thoughts!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-[rgb(var(--color-muted-foreground))]">
        {comments.length} {comments.length === 1 ? "comment" : "comments"}
      </p>
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="border border-[rgb(var(--color-border))] rounded-lg p-6 bg-[rgb(var(--color-muted))]/30"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">{comment.name}</h4>
            <time className="text-sm text-[rgb(var(--color-muted-foreground))]">
              {formatDate(comment.createdAt)}
            </time>
          </div>
          <p className="text-[rgb(var(--color-foreground))] whitespace-pre-wrap">
            {comment.comment}
          </p>
        </div>
      ))}
    </div>
  );
}