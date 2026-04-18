import { describe, it, expect, vi } from 'vitest';
import { VerifyCredentialsUseCase } from '../../../src/core/users/application/VerifyCredentialsUseCase';
import { IUserRepository } from '../../../src/core/users/application/IUserRepository';

describe('VerifyCredentialsUseCase', () => {
  it('should return null for invalid Zod inputs', async () => {
    const mockRepo = {} as IUserRepository;
    const useCase = new VerifyCredentialsUseCase(mockRepo);

    const result = await useCase.execute('not-an-email', '');
    expect(result).toBeNull();
  });

  it('should normalize email before calling repository', async () => {
    const mockRepo: IUserRepository = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
      findById: vi.fn(),
    };

    const useCase = new VerifyCredentialsUseCase(mockRepo);
    await useCase.execute('  USER@Domain.com  ', 'password123');

    expect(mockRepo.findByEmail).toHaveBeenCalledWith('user@domain.com');
  });
});
