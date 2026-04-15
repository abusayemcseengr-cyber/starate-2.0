import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { celebrityId, score } = await req.json();

    if (
      typeof celebrityId !== "string" ||
      typeof score !== "number" ||
      score < 0 ||
      score > 10
    ) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    // Upsert: update if the user already rated this celebrity
    const rating = await prisma.rating.upsert({
      where: {
        userId_celebrityId: {
          userId: session.user.id,
          celebrityId,
        },
      },
      create: {
        score,
        userId: session.user.id,
        celebrityId,
      },
      update: { score },
    });

    // Recalculate real average from all ratings
    const agg = await prisma.rating.aggregate({
      where: { celebrityId },
      _avg: { score: true },
      _count: { score: true },
    });

    await prisma.celebrity.update({
      where: { id: celebrityId },
      data: {
        avgRating:  agg._avg.score  ?? 0,
        totalVotes: agg._count.score,
      },
    });

    return NextResponse.json(rating);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
