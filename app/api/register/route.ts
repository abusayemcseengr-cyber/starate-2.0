import { NextResponse } from 'next/server';
import { registerUserUseCase } from '@/src/core/container';
import { isRateLimited } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (isRateLimited(`register:${ip}`, { windowMs: 15 * 60 * 1000, max: 5 })) {
      return NextResponse.json(
        { message: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const user = await registerUserUseCase.execute({ name, email, password });

    return NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    );
  } catch (err: any) {
    if (err.message === 'Email already in use') {
      return NextResponse.json({ message: err.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
  }
}
