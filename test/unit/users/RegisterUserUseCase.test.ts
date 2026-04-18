import { describe, it, expect, vi } from 'vitest';
import { RegisterUserUseCase } from '../../../src/core/users/application/RegisterUserUseCase';
import { IUserRepository } from '../../../src/core/users/application/IUserRepository';
import { User } from '../../../src/core/users/domain/User';

describe('RegisterUserUseCase', () => {
  it('should throw Zod error for invalid input', async () => {
    const mockRepo = {} as IUserRepository;
    const useCase = new RegisterUserUseCase(mockRepo);

    await expect(
      useCase.execute({ name: '', email: 'invalid', password: '123' })
    ).rejects.toThrow();
  });

  it('should normalize email to lowercase and trim', async () => {
    const mockRepo: IUserRepository = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi
        .fn()
        .mockImplementation((u) =>
          Promise.resolve({ ...u, id: '1', createdAt: new Date() })
        ),
      findById: vi.fn(),
    };

    const useCase = new RegisterUserUseCase(mockRepo);
    await useCase.execute({
      name: 'Test User',
      email: '  Test@Example.COM  ',
      password: 'password123',
    });

    expect(mockRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'test@example.com',
      })
    );
  });
});
