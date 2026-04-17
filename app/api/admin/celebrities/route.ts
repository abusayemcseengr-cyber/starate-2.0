import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Helper to check admin role
async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return false;
  }
  return true;
}

export async function GET() {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const celebrities = await prisma.celebrity.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(celebrities);
  } catch (err) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, photo, bio, category, nationality } = body;

    if (!name || !photo || !bio || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newCel = await prisma.celebrity.create({
      data: { name, photo, bio, category, nationality },
    });

    return NextResponse.json(newCel, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, name, photo, bio, category, nationality } = body;

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const updated = await prisma.celebrity.update({
      where: { id },
      data: { name, photo, bio, category, nationality },
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    // Delete related ratings first due to foreign keys
    await prisma.rating.deleteMany({
      where: { celebrityId: id },
    });

    await prisma.celebrity.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
