import {
  ICelebrityRepository,
  GetNextCelebrityCriteria,
} from '../application/ICelebrityRepository';
import { Celebrity } from '../domain/Celebrity';
import { PrismaClient } from '@prisma/client';

export class PrismaCelebrityRepository implements ICelebrityRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Celebrity | null> {
    const data = await this.prisma.celebrity.findUnique({ where: { id } });
    if (!data) return null;
    return this.mapToDomain(data);
  }

  async countActive(criteria?: GetNextCelebrityCriteria): Promise<number> {
    return await this.prisma.celebrity.count({
      where: this.buildWhere(criteria),
    });
  }

  async findNext(
    skip: number,
    criteria?: GetNextCelebrityCriteria
  ): Promise<Celebrity | null> {
    const data = await this.prisma.celebrity.findFirst({
      where: this.buildWhere(criteria),
      skip,
    });
    if (!data) return null;
    return this.mapToDomain(data);
  }

  async updateStatsWithNewRating(
    celebrityId: string,
    _additionalScore: number
  ): Promise<void> {
    const agg = await this.prisma.rating.aggregate({
      where: { celebrityId },
      _avg: { score: true },
      _count: { score: true },
    });

    await this.prisma.celebrity.update({
      where: { id: celebrityId },
      data: {
        avgRating: agg._avg.score ?? 0,
        totalVotes: agg._count.score,
      },
    });
  }

  private buildWhere(criteria?: GetNextCelebrityCriteria): any {
    const where: any = {};
    if (criteria?.excludeIds && criteria.excludeIds.length > 0) {
      where.id = { notIn: criteria.excludeIds };
    }
    return where;
  }

  private mapToDomain(data: any): Celebrity {
    return {
      id: data.id,
      name: data.name,
      photo: data.photo,
      bio: data.bio,
      category: data.category,
      nationality: data.nationality,
      avgRating: data.avgRating,
      totalVotes: data.totalVotes,
    };
  }
}
