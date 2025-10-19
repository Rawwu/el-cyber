"use client";

import { useState } from "react";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";

interface CommentSectionProps {
  postSlug: string;
}

export function CommentSection({ postSlug }: CommentSectionProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCommentSubmitted = () => {
    // Trigger a refresh of the comment list
    // New comments won't appear until approved
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div id="comments">
      <h2 className="text-2xl font-bold mb-8">Comments</h2>

      {/* Comment List */}
      <div className="mb-12">
        <CommentList postSlug={postSlug} refreshTrigger={refreshTrigger} />
      </div>

      {/* Comment Form */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>
        <CommentForm postSlug={postSlug} onCommentSubmitted={handleCommentSubmitted} />
      </div>
    </div>
  );
}