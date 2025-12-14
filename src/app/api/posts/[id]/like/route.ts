import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const { isLiked } = await req.json();
    const userId = session.user.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Post ID is required" },
        { status: 400 }
      );
    }

    if (isLiked) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId: id,
          },
        },
      });
    } else {
      await prisma.like.create({
        data: {
          userId,
          postId: id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Successfully updated like status",
      err: {},
    });
  } catch (error) {
    console.error("Like post error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Not able to like the post",
        error,
      },
      { status: 500 }
    );
  }
}
