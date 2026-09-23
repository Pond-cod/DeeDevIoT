import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  // Check if there is a session cookie
  const session = request.cookies.get('admin_session');

  // If there's no session or the cryptographic signature is invalid/expired, redirect to /login
  const isValid = session ? await verifySessionToken(session.value) : false;
  if (!isValid) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to proceed if authenticated
  return NextResponse.next();
}

// Matching Admin Paths
export const config = {
  matcher: ['/admin/:path*'],
};

