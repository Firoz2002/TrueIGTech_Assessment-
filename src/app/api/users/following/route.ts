import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user_id = session.user.id;

        const following = await prisma.follow.findMany({
            where: {
                followerId: user_id,
            },
            include: {
                followee: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const users = following.map((f) => ({
            id: f.followee.id,
            name: f.followee.name,
            image: f.followee.image,
            followedAt: f.createdAt,
        }));

        return NextResponse.json({
            data: users,
            success: true,
            message: "Successfully fetched following users",
            err: {},
        });
    } catch (error) {
        console.error("Following fetch error:", error);
        return NextResponse.json(
            {
                data: [],
                success: false,
                message: "Failed to fetch following users",
                error,
            },
            { status: 500 }
        );
    }
}
