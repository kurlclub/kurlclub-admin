import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;

  const publicPaths = ['/auth/login', '/auth/reset'];

  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (!accessToken && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (accessToken && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/dashboard', '/(api|trpc)(.*)'],
};
