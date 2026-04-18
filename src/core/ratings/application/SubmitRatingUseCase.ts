import { IRatingRepository } from './IRatingRepository';
import { ICelebrityRepository } from '../../celebrities/application/ICelebrityRepository';
import { Rating } from '../domain/Rating';

export class SubmitRatingUseCase {
  constructor(
    private readonly ratingRepo: IRatingRepository,
    private readonly celebrityRepo: ICelebrityRepository
  ) {}

  async execute(
    userId: string,
    celebrityId: string,
    score: number
  ): Promise<Rating> {
    if (score < 1 || score > 10) {
      throw new Error('Invalid rating score. Must be between 1 and 10.');
    }

    const rating = await this.ratingRepo.save({ userId, celebrityId, score });

    // Notice how we've decoupled the 'update rating logic' from the controller
    await this.celebrityRepo.updateStatsWithNewRating(celebrityId, score);

    return rating;
  }
}
