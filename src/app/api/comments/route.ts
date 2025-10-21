import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { commentRateLimiter } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/get-ip";

// Validation schema
const commentSchema = z.object({
  postSlug: z.string().min(1, "Post slug is required"),
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  comment: z.string().min(1, "Comment is required").max(1000, "Comment is too long"),
  honeypot: z.string().optional(), // Honeypot field
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
    // Get client IP for rate limiting
    const clientIp = getClientIp(request);
    
    // Check rate limit
    const rateLimitResult = commentRateLimiter.check(clientIp);
    
    if (!rateLimitResult.success) {
      const resetIn = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        { error: `Too many requests. Please try again in ${resetIn} seconds.` },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          }
        }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = commentSchema.safeParse(body);
    
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const { postSlug, name, email, comment, honeypot } = validationResult.data;

    // Honeypot check - if filled, it's a bot
    if (honeypot && honeypot.trim() !== "") {
      console.log("Honeypot triggered by:", clientIp);
      // Return success to not alert the bot
      return NextResponse.json(
        { message: "Comment submitted successfully! It will appear after approval." },
        { status: 201 }
      );
    }

    // Enhanced spam detection
    const spamPatterns = [
      /\b(viagra|cialis|casino|poker|lottery|pills|supplement)\b/i,
      /\b(buy now|click here|limited offer|act now)\b/i,
      /https?:\/\/.*https?:\/\//i, // Multiple URLs
      /<script|<iframe|javascript:/i, // Malicious scripts
      /\[url=|<a href=/i, // BBCode or HTML links
    ];

    const containsSpam = spamPatterns.some(pattern => 
      pattern.test(comment) || pattern.test(name)
    );

    if (containsSpam) {
      console.log("Spam detected from:", clientIp);
      return NextResponse.json(
        { error: "Comment appears to be spam" },
        { status: 400 }
      );
    }

    // Check for excessive caps
    const capsPercentage = (comment.match(/[A-Z]/g) || []).length / comment.length;
    if (capsPercentage > 0.5 && comment.length > 20) {
      return NextResponse.json(
        { error: "Please don't use excessive capital letters" },
        { status: 400 }
      );
    }

    // Check for repeated characters
    if (/(.)\1{10,}/.test(comment)) {
      return NextResponse.json(
        { error: "Comment contains suspicious patterns" },
        { status: 400 }
      );
    }

    // Create comment (Needs manual approval)
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
      { 
        status: 201,
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        }
      }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to submit comment" },
      { status: 500 }
    );
  }
}