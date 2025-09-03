import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const kitId = params.id;
  const { videoId } = await req.json();

  if (!videoId) return NextResponse.json({ error: "Missing videoId" }, { status: 400 });

  try {
    const kit = await prisma.kit.update({
      where: { id: kitId },
      data: {
        videos: {
          deleteMany: { videoId } // <-- Use deleteMany here
        }
      },
      include: { videos: true }
    });

    return NextResponse.json(kit);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to remove video" }, { status: 500 });
  }
}
