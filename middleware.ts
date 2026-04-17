import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "admin";
  const isOnAuthRoute = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');
  const isOnAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');

  if (isApiRoute) {
    return;
  }

  if (isOnAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL('/login', req.nextUrl));
    }
    if (!isAdmin) {
      return Response.redirect(new URL('/', req.nextUrl));
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
