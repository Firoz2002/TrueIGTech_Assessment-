import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });

        const user_id = session.user.id;

        const following = await prisma.follow.findMany({
            where: {
                followerId: user_id
            },
            select: {
                followeeId: true,
            }
        });

        const feedUserIds = [
            user_id,
            ...following.map((follow) => follow.followeeId),
        ];

        const posts = await prisma.post.findMany({
            where: {
                userId: {
                    in: feedUserIds,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                likes: true,
                comments: {
                    orderBy: {
                      createdAt: 'asc',
                    },
                }
            },
        });

    return NextResponse.json({
      data: posts,
      success: true,
      message: "Successfully fetched feed",
      err: {},
    }); 

    } catch (error) {
        console.error("Error while fetching user feed:", error);

        return NextResponse.json(
            {
                data: {},
                success: false,
                message: "Not able to fetch feed",
                error,
            },
            { status: 500 }
        );
    }
}