import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit") ?? "50"), 100);

    const celebrities = await prisma.celebrity.findMany({
      where: { totalVotes: { gt: 0 } },
      orderBy: [{ avgRating: "desc" }, { totalVotes: "desc" }],
      take: limit,
      select: {
        id: true,
        name: true,
        photo: true,
        category: true,
        nationality: true,
        avgRating: true,
        totalVotes: true,
      },
    });

    // Append celebrities with no votes at the end (unranked)
    const unranked = await prisma.celebrity.findMany({
      where: { totalVotes: 0 },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        photo: true,
        category: true,
        nationality: true,
        avgRating: true,
        totalVotes: true,
      },
    });

    return NextResponse.json({ ranked: celebrities, unranked });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
