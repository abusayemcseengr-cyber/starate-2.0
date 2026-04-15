import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalCelebrities, totalRatings, totalUsers, agg] = await Promise.all([
      prisma.celebrity.count(),
      prisma.rating.count(),
      prisma.user.count(),
      prisma.rating.aggregate({ _avg: { score: true } }),
    ]);

    return NextResponse.json({
      totalCelebrities,
      totalRatings,
      totalUsers,
      platformAvg: agg._avg.score != null
        ? Math.round(agg._avg.score * 10) / 10
        : null,
    });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
