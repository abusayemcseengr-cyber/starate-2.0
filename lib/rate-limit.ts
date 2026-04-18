const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export interface RateLimitOptions {
  windowMs: number;
  max: number;
}

export function isRateLimited(
  identifier: string,
  options: RateLimitOptions
): boolean {
  const now = Date.now();
  const userData = rateLimitMap.get(identifier);

  if (!userData || now - userData.lastReset > options.windowMs) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return false;
  }

  userData.count++;
  if (userData.count > options.max) {
    return true;
  }

  return false;
}
