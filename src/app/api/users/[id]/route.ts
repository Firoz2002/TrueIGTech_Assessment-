import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,

        posts: {
          orderBy: { createdAt: "desc" },
          include: {
            likes: true,
            comments: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },

        followers: {
          include: {
            follower: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },

        following: {
          include: {
            followee: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },

        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
