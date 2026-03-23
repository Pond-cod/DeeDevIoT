import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if there is a session cookie
  const session = request.cookies.get('admin_session');

  // If there's no session and the user is trying to access /admin, redirect them to /login
  if (!session || session.value !== 'authenticated') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to proceed if authenticated
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
};
