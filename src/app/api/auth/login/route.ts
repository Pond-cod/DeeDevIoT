import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSessionToken } from '../../../../lib/auth';
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '../../../../lib/rateLimit';

export async function POST(request: Request) {
  try {
    // Get client identifier for rate limiting (IP from standard proxy headers)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || 'anonymous';
    const rateLimitKey = `login:${clientIp}`;

    // Rate limit check: Max 5 failed attempts per 15 minutes
    const rateLimit = checkRateLimit(rateLimitKey, { maxAttempts: 5, windowMs: 15 * 60 * 1000 });
    if (!rateLimit.isAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: `พยายามเข้าสู่ระบบไม่ถูกต้องเกินกำหนด กรุณารออีก ${Math.ceil(rateLimit.retryAfterSeconds / 60)} นาที`,
          retryAfter: rateLimit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { username, password } = body;

    const envUsername = process.env.ADMIN_USERNAME || 'admin';
    const envPassword = process.env.ADMIN_PASSWORD;

    // Fail-safe: Never use a hardcoded fallback password
    if (!envPassword) {
      console.error('CRITICAL: ADMIN_PASSWORD environment variable is not configured!');
      return NextResponse.json(
        { success: false, error: 'Server authentication configuration error' },
        { status: 500 }
      );
    }

    // Verify credentials
    if (username === envUsername && password === envPassword) {
      // Reset rate limit counter on successful login
      resetRateLimit(rateLimitKey);

      // Generate cryptographically signed session token
      const sessionToken = await createSessionToken(username);

      // Set secure HTTP-only cookie with signed token
      (await cookies()).set('admin_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });

      return NextResponse.json({ success: true });
    }

    // Failed login attempt: record against rate limit
    recordFailedAttempt(rateLimitKey);

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid username or password',
        remainingAttempts: Math.max(0, rateLimit.remainingAttempts - 1),
      },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

