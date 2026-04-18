import { Celebrity } from '../domain/Celebrity';

export interface GetNextCelebrityCriteria {
  excludeIds?: string[];
}

export interface ICelebrityRepository {
  findById(id: string): Promise<Celebrity | null>;
  countActive(criteria?: GetNextCelebrityCriteria): Promise<number>;
  findNext(
    skip: number,
    criteria?: GetNextCelebrityCriteria
  ): Promise<Celebrity | null>;
  updateStatsWithNewRating(
    celebrityId: string,
    additionalScore: number
  ): Promise<void>;
}
