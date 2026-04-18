import { Rating } from '../domain/Rating';

export interface IRatingRepository {
  findByUser(userId: string): Promise<Rating[]>;
  save(rating: Omit<Rating, 'id' | 'createdAt'>): Promise<Rating>;
}
