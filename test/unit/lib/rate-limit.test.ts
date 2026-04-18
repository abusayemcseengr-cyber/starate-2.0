import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { isRateLimited } from '../../../lib/rate-limit';

describe('Rate Limiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should allow requests below the max limit', () => {
    const identifier = 'test_user_1';
    const options = { windowMs: 1000, max: 2 };

    expect(isRateLimited(identifier, options)).toBe(false); // count = 1
    expect(isRateLimited(identifier, options)).toBe(false); // count = 2
  });

  it('should block requests above the max limit', () => {
    const identifier = 'test_user_2';
    const options = { windowMs: 1000, max: 2 };

    expect(isRateLimited(identifier, options)).toBe(false); // count = 1
    expect(isRateLimited(identifier, options)).toBe(false); // count = 2
    expect(isRateLimited(identifier, options)).toBe(true); // count = 3 (blocked)
    expect(isRateLimited(identifier, options)).toBe(true); // count = 4 (blocked)
  });

  it('should reset the limit after the window expires', () => {
    const identifier = 'test_user_3';
    const options = { windowMs: 1000, max: 1 };

    expect(isRateLimited(identifier, options)).toBe(false); // count = 1
    expect(isRateLimited(identifier, options)).toBe(true); // count = 2 (blocked)

    // Advance time past the windowMs
    vi.advanceTimersByTime(1500);

    // Limit should be reset
    expect(isRateLimited(identifier, options)).toBe(false); // count = 1 (new window)
  });

  it('should track different identifiers independently', () => {
    const options = { windowMs: 1000, max: 1 };

    expect(isRateLimited('user_a', options)).toBe(false);
    expect(isRateLimited('user_b', options)).toBe(false);

    expect(isRateLimited('user_a', options)).toBe(true); // user_a blocked
    expect(isRateLimited('user_c', options)).toBe(false); // user_c allowed
  });
});
