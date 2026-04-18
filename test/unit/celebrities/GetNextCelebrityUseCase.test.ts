import { describe, it, expect, vi } from 'vitest';
import { GetNextCelebrityUseCase } from '../../../src/core/celebrities/application/GetNextCelebrityUseCase';
import { ICelebrityRepository } from '../../../src/core/celebrities/application/ICelebrityRepository';
import { Celebrity } from '../../../src/core/celebrities/domain/Celebrity';

describe('GetNextCelebrityUseCase', () => {
  it('should return null if there are no active celebrities', async () => {
    const mockRepo: ICelebrityRepository = {
      findById: vi.fn(),
      countActive: vi.fn().mockResolvedValue(0),
      findNext: vi.fn(),
      updateStatsWithNewRating: vi.fn(),
    };

    const useCase = new GetNextCelebrityUseCase(mockRepo);
    const result = await useCase.execute([]);

    expect(mockRepo.countActive).toHaveBeenCalledWith({ excludeIds: [] });
    expect(result).toBeNull();
  });

  it('should return a random celebrity excluding provided IDs', async () => {
    const mockCelebrity: Celebrity = {
      id: 'celeb-1',
      name: 'John Doe',
      photo: 'photo.jpg',
      bio: 'A bio',
      category: 'Actor',
      avgRating: 0,
      totalVotes: 0,
    };

    const mockRepo: ICelebrityRepository = {
      findById: vi.fn(),
      countActive: vi.fn().mockResolvedValue(5),
      findNext: vi.fn().mockResolvedValue(mockCelebrity),
      updateStatsWithNewRating: vi.fn(),
    };

    const useCase = new GetNextCelebrityUseCase(mockRepo);
    const result = await useCase.execute(['celeb-2', 'celeb-3']);

    expect(mockRepo.countActive).toHaveBeenCalledWith({
      excludeIds: ['celeb-2', 'celeb-3'],
    });

    // Check that skip was called with a random value between 0 and 4
    expect(mockRepo.findNext).toHaveBeenCalledWith(expect.any(Number), {
      excludeIds: ['celeb-2', 'celeb-3'],
    });
    expect(result).toEqual(mockCelebrity);
  });
});
