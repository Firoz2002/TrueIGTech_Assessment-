import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { upload } from "@/lib/cloudinary";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const content = formData.get("content") as string | null;
    const file = formData.get("file") as File | null;

    if (!content && !file) {
      return NextResponse.json(
        { success: false, message: "Post cannot be empty" },
        { status: 400 }
      );
    }

    let media: string[] = [];


    if (file) {
        const file_url = await upload(file);
        media.push(file_url);
    }

    const post = await prisma.post.create({
      data: {
        content: content || "",
        media,
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

    return NextResponse.json({
      success: true,
      data: post,
      message: "Post created successfully",
    });

  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create post",
        error,
      },
      { status: 500 }
    );
  }
}
