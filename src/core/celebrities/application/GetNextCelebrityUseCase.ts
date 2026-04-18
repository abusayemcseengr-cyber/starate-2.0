import { ICelebrityRepository } from './ICelebrityRepository';
import { Celebrity } from '../domain/Celebrity';

export class GetNextCelebrityUseCase {
  constructor(private readonly celebrityRepo: ICelebrityRepository) {}

  async execute(excludeIds: string[] = []): Promise<Celebrity | null> {
    const count = await this.celebrityRepo.countActive({ excludeIds });

    if (count === 0) {
      return null; // Signals the frontend that no more celebrities are available
    }

    const skip = Math.floor(Math.random() * count);
    return await this.celebrityRepo.findNext(skip, { excludeIds });
  }
}
