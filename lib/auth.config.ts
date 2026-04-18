import type { NextAuthConfig } from 'next-auth';
import { Role } from '@prisma/client';

export const authConfig = {
  providers: [], // Add providers with Edge compatibility here if needed, else leave empty for Node-only providers
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
} satisfies NextAuthConfig;
