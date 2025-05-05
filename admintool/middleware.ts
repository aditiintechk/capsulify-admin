import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isLockedOut } from './app/lib/session';

export async function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isAuthRoute = request.nextUrl.pathname === '/auth';

  // Allow access to auth route
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // Check if user is locked out
  const lockedOut = await isLockedOut();
  if (lockedOut) {
    if (isApiRoute) {
      return NextResponse.json(
        { error: 'Too many failed attempts. Please try again later.' },
        { status: 429 }
      );
    }
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Block access to all routes if not authenticated
  if (!isAuthenticated) {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 