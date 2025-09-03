import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust to your prisma import

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const kitId = params.id;
  const body = await req.json();
  const { videoIds } = body; // array of video IDs

  if (!videoIds || !videoIds.length)
    return NextResponse.json({ error: "Missing videoIds" }, { status: 400 });

  try {
    const kit = await prisma.kit.update({
      where: { id: kitId },
      data: {
        videos: {
          create: videoIds.map((id: string) => ({ videoId: id })) // adjust to your DB relation
        }
      },
      include: { videos: true }
    });
    return NextResponse.json(kit);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add videos" }, { status: 500 });
  }
}
