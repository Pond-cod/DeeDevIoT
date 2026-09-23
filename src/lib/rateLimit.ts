interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  maxAttempts?: number;
  windowMs?: number;
}

export function checkRateLimit(
  key: string,
  options: RateLimitOptions = {}
): { isAllowed: boolean; remainingAttempts: number; retryAfterSeconds: number } {
  const maxAttempts = options.maxAttempts ?? 5;
  const windowMs = options.windowMs ?? 15 * 60 * 1000; // 15 minutes
  const now = Date.now();

  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    return {
      isAllowed: true,
      remainingAttempts: maxAttempts,
      retryAfterSeconds: 0,
    };
  }

  if (record.count >= maxAttempts) {
    const retryAfterSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
    return {
      isAllowed: false,
      remainingAttempts: 0,
      retryAfterSeconds,
    };
  }

  return {
    isAllowed: true,
    remainingAttempts: maxAttempts - record.count,
    retryAfterSeconds: 0,
  };
}

export function recordFailedAttempt(key: string, windowMs: number = 15 * 60 * 1000): void {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
  } else {
    record.count += 1;
  }
}

export function resetRateLimit(key: string): void {
  rateLimitMap.delete(key);
}
