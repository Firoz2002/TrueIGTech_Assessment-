import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const following = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followeeId: true,
      },
    });

    const excludedUserIds = [
      userId,
      ...following.map((f) => f.followeeId)
    ];
    
    const users = await prisma.user.findMany({
      where: {
        id: {
          notIn: excludedUserIds ,
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: users,
      err: {},
    });

  } catch (error) {
    console.error("Error in fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Some error occurred",
        error,
      },
      { status: 500 }
    );
  }
}
