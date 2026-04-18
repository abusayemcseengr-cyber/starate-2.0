import { IUserRepository } from './IUserRepository';
import { User } from '../domain/User';
import { RegisterUserSchema } from '../domain/validation';
import bcrypt from 'bcryptjs';

export class RegisterUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(
    rawPayload: Omit<User, 'id' | 'createdAt' | 'role'>
  ): Promise<User> {
    const payload = RegisterUserSchema.parse(rawPayload);
    const normalizedEmail = payload.email.toLowerCase().trim();

    const existing = await this.userRepo.findByEmail(normalizedEmail);
    if (existing) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    return await this.userRepo.create({
      ...payload,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'USER',
    });
  }
}
