import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema
const commentSchema = z.object({
  postSlug: z.string().min(1, "Post slug is required"),
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  comment: z.string().min(1, "Comment is required").max(1000, "Comment is too long"),
});

// GET - Fetch approved comments for a post
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postSlug = searchParams.get("postSlug");

    if (!postSlug) {
      return NextResponse.json(
        { error: "Post slug is required" },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        postSlug,
        isApproved: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        comment: true,
        createdAt: true,
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST - Submit a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = commentSchema.safeParse(body);
    
    if (!validationResult.success) {
      // Handle Zod validation errors properly
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const { postSlug, name, email, comment } = validationResult.data;

    // Basic spam detection - check for common spam patterns
    const spamPatterns = [
      /\b(viagra|cialis|casino|poker)\b/i,
      /https?:\/\/.*https?:\/\//i, // Multiple URLs
      /<script/i, // Script tags
    ];

    const isSpam = spamPatterns.some(pattern => 
      pattern.test(comment) || pattern.test(name)
    );

    if (isSpam) {
      return NextResponse.json(
        { error: "Comment appears to be spam" },
        { status: 400 }
      );
    }

    // Create comment (will need manual approval)
    const newComment = await prisma.comment.create({
      data: {
        postSlug,
        name,
        email: email || null,
        comment,
        isApproved: false, // Requires manual approval
      },
    });

    return NextResponse.json(
      { 
        message: "Comment submitted successfully! It will appear after approval.",
        commentId: newComment.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to submit comment" },
      { status: 500 }
    );
  }
}