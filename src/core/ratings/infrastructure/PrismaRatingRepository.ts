import { IRatingRepository } from '../application/IRatingRepository';
import { Rating } from '../domain/Rating';
import { PrismaClient } from '@prisma/client';

export class PrismaRatingRepository implements IRatingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByUser(userId: string): Promise<Rating[]> {
    const data = await this.prisma.rating.findMany({
      where: { userId },
    });
    return data.map(this.mapToDomain);
  }

  async save(ratingPayload: Omit<Rating, 'id' | 'createdAt'>): Promise<Rating> {
    const data = await this.prisma.rating.upsert({
      where: {
        userId_celebrityId: {
          userId: ratingPayload.userId,
          celebrityId: ratingPayload.celebrityId,
        },
      },
      update: { score: ratingPayload.score },
      create: {
        userId: ratingPayload.userId,
        celebrityId: ratingPayload.celebrityId,
        score: ratingPayload.score,
      },
    });
    return this.mapToDomain(data);
  }

  private mapToDomain(data: any): Rating {
    return {
      id: data.id,
      score: data.score,
      userId: data.userId,
      celebrityId: data.celebrityId,
      createdAt: data.createdAt,
    };
  }
}
