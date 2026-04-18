import { IUserRepository } from './IUserRepository';
import { User } from '../domain/User';
import { LoginSchema } from '../domain/validation';
import bcrypt from 'bcryptjs';

export class VerifyCredentialsUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(email: string, password?: string): Promise<User | null> {
    const validated = LoginSchema.safeParse({ email, password });
    if (!validated.success) return null;

    const normalizedEmail = validated.data.email.toLowerCase().trim();

    const user = await this.userRepo.findByEmail(normalizedEmail);
    if (!user || !user.password) return null;

    const matches = await bcrypt.compare(
      validated.data.password,
      user.password
    );
    if (!matches) return null;

    // Return user without password for safety
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
}
