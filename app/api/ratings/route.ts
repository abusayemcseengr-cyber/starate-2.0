import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { submitRatingUseCase } from '@/src/core/container';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { celebrityId, score } = await req.json();

    if (
      typeof celebrityId !== 'string' ||
      typeof score !== 'number' ||
      score < 0 ||
      score > 10
    ) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    const rating = await submitRatingUseCase.execute(
      session.user.id,
      celebrityId,
      score
    );

    return NextResponse.json(rating);
  } catch (err: any) {
    if (err.message.includes('Invalid rating score')) {
      return NextResponse.json({ message: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
