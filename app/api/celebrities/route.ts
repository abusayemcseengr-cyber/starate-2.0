import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getNextCelebrityUseCase, ratingRepo } from '@/src/core/container';

export async function GET() {
  try {
    const session = await auth();
    let excludeIds: string[] = [];

    if (session?.user?.id) {
      const rated = await ratingRepo.findByUser(session.user.id);
      excludeIds = rated.map((r) => r.celebrityId);
    }

    const celebrity = await getNextCelebrityUseCase.execute(excludeIds);

    if (!celebrity) {
      return NextResponse.json(
        { error: 'No more celebrities to rate', allRated: true },
        { status: 404 }
      );
    }

    return NextResponse.json(celebrity);
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
