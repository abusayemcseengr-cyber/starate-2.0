import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRoleSchema } from '@/src/core/users/domain/validation';

async function checkAdmin(req: Request) {
  const pwd = req.headers.get('x-admin-password');
  return pwd === process.env.ADMIN_SECRET;
}

export async function GET(req: Request) {
  try {
    if (!(await checkAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { ratings: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    if (!(await checkAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, role } = await req.json();

    if (!id || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const parsed = UserRoleSchema.safeParse(role?.toUpperCase());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    const validatedRole = parsed.data;

    // Prevent removing the last admin
    if (validatedRole !== 'ADMIN') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) {
        const userToChange = await prisma.user.findUnique({
          where: { id },
          select: { role: true },
        });
        if (userToChange?.role === 'ADMIN') {
          return NextResponse.json(
            { error: 'Cannot remove the only administrator' },
            { status: 400 }
          );
        }
      }
    }

    await prisma.user.update({
      where: { id },
      data: { role: validatedRole },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
