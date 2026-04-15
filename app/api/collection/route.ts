import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const ratings = await prisma.rating.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        celebrity: {
          select: {
            id: true,
            name: true,
            photo: true,
            category: true,
            nationality: true,
            avgRating: true,
            totalVotes: true,
          },
        },
      },
    });

    // Flatten: attach user's own score to each celebrity
    const items = ratings.map((r) => ({
      ratingId:  r.id,
      score:     r.score,
      ratedAt:   r.createdAt,
      celebrity: r.celebrity,
    }));

    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
