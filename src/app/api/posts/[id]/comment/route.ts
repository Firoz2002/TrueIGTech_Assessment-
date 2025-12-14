import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { message: "Comment cannot be empty" },
        { status: 400 }
      );
    }

    const { id } = await context.params;

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: id,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: comment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while adding a new comment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add comment",
      },
      { status: 500 }
    );
  }
}
