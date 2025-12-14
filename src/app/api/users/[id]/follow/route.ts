import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const params = await context.params;

    const followerId = session.user.id;
    const followeeId = params.id;

    if (followerId === followeeId) {
      return NextResponse.json(
        { success: false, message: "You cannot follow yourself" },
        { status: 400 }
      );
    }

    await prisma.follow.create({
      data: {
        followerId,
        followeeId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully followed user",
      err: {},
    });
  } catch (error: any) {
    console.error("Error while following user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to follow user",
        error,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const params = await context.params;
    const followerId = session.user.id;
    const followeeId = params.id;

    if (followerId === followeeId) {
      return NextResponse.json(
        { success: false, message: "You cannot unfollow yourself" },
        { status: 400 }
      );
    }

    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId,
        followeeId,
      },
    });

    if (!existingFollow) {
      return NextResponse.json(
        { success: false, message: "User is not being followed by you" },
        { status: 400 }
      );
    }

    await prisma.follow.deleteMany({
      where: {
        followerId,
        followeeId,
      }
    });

    return NextResponse.json({
      success: true,
      message: "Successfully unfollowed user",
      err: {},
    });
  } catch (error: any) {
    console.error("Error while unfollowing user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to unfollow user",
        error,
      },
      { status: 500 }
    );
  }
}