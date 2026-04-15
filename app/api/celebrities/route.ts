import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    // Get already-rated IDs for the current session user
    let excludeIds: string[] = [];
    const session = await auth();
    if (session?.user?.id) {
      const rated = await prisma.rating.findMany({
        where: { userId: session.user.id },
        select: { celebrityId: true },
      });
      excludeIds = rated.map((r) => r.celebrityId);
    }

    const count = await prisma.celebrity.count({
      where: { id: { notIn: excludeIds } },
    });

    if (count === 0) {
      return NextResponse.json(
        { error: "No more celebrities to rate", allRated: true },
        { status: 404 }
      );
    }

    const skip = Math.floor(Math.random() * count);
    const celebrity = await prisma.celebrity.findFirst({
      where: { id: { notIn: excludeIds } },
      skip,
    });

    return NextResponse.json(celebrity);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
