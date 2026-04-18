import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { verifyCredentialsUseCase } from '@/src/core/container';
import { authConfig } from './auth.config';
import { isRateLimited } from './rate-limit';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (
          isRateLimited(`login:${credentials?.email}`, {
            windowMs: 15 * 60 * 1000,
            max: 10,
          })
        ) {
          throw new Error('Too many login attempts. Please try again later.');
        }

        const user = await verifyCredentialsUseCase.execute(
          credentials?.email as string,
          credentials?.password as string
        );

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
        return null;
      },
    }),
  ],
});
