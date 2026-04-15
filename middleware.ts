import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAuthRoute = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');

  if (isApiRoute) {
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
