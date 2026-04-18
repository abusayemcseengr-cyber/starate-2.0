import { describe, it, expect, vi } from 'vitest';
import { SubmitRatingUseCase } from '../../../src/core/ratings/application/SubmitRatingUseCase';
import { IRatingRepository } from '../../../src/core/ratings/application/IRatingRepository';
import { ICelebrityRepository } from '../../../src/core/celebrities/application/ICelebrityRepository';
import { Rating } from '../../../src/core/ratings/domain/Rating';

describe('SubmitRatingUseCase', () => {
  it('should throw an error if score is out of bounds', async () => {
    const mockRatingRepo = {
      findByUser: vi.fn(),
      save: vi.fn(),
    } as unknown as IRatingRepository;
    const mockCelebrityRepo = {
      updateStatsWithNewRating: vi.fn(),
    } as unknown as ICelebrityRepository;

    const useCase = new SubmitRatingUseCase(mockRatingRepo, mockCelebrityRepo);

    await expect(useCase.execute('user1', 'celeb1', 0)).rejects.toThrow(
      'Invalid rating score. Must be between 1 and 10.'
    );
    await expect(useCase.execute('user1', 'celeb1', 11)).rejects.toThrow(
      'Invalid rating score. Must be between 1 and 10.'
    );
  });

  it('should save the rating and update celebrity stats correctly', async () => {
    const mockRating: Rating = {
      id: 'rating-1',
      userId: 'user-1',
      celebrityId: 'celeb-1',
      score: 8,
      createdAt: new Date(),
    };

    const mockRatingRepo: IRatingRepository = {
      findByUser: vi.fn(),
      save: vi.fn().mockResolvedValue(mockRating),
    };

    const mockCelebrityRepo: ICelebrityRepository = {
      findById: vi.fn(),
      countActive: vi.fn(),
      findNext: vi.fn(),
      updateStatsWithNewRating: vi.fn().mockResolvedValue(undefined),
    };

    const useCase = new SubmitRatingUseCase(mockRatingRepo, mockCelebrityRepo);
    const result = await useCase.execute('user-1', 'celeb-1', 8);

    expect(mockRatingRepo.save).toHaveBeenCalledWith({
      userId: 'user-1',
      celebrityId: 'celeb-1',
      score: 8,
    });
    expect(mockCelebrityRepo.updateStatsWithNewRating).toHaveBeenCalledWith(
      'celeb-1',
      8
    );
    expect(result).toEqual(mockRating);
  });
});
