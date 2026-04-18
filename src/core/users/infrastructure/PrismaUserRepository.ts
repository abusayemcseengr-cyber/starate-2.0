import { IUserRepository } from '../application/IUserRepository';
import { User } from '../domain/User';
import { PrismaClient } from '@prisma/client';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { id } });
    if (!data) return null;
    return this.mapToDomain(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { email } });
    if (!data) return null;
    return this.mapToDomain(data);
  }

  async create(payload: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const data = await this.prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: payload.password || '',
        avatar: payload.avatar,
        role: payload.role || 'USER',
      },
    });
    return this.mapToDomain(data);
  }

  private mapToDomain(data: any): User {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      avatar: data.avatar,
      role: data.role as 'USER' | 'ADMIN',
      createdAt: data.createdAt,
    };
  }
}
