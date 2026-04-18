import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAuthRoute =
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/register');
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

  const isUserAdmin = req.auth?.user?.role === 'ADMIN';

  if (isApiRoute) {
    return;
  }

  if (isAdminRoute) {
    if (!isUserAdmin) {
      return Response.redirect(new URL('/login', req.nextUrl));
    }
    return;
  }

  if (isOnAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL('/rate', req.nextUrl));
    }
    return;
  }

  if (!isLoggedIn && req.nextUrl.pathname !== '/') {
    return Response.redirect(new URL('/login', req.nextUrl));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
