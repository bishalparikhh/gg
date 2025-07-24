// lib/rateLimiter.ts

type RateLimitRecord = {
  count: number;
  lastRequestTime: number;
};

// In-memory store for rate limit counters
const rateLimitStore: Record<string, RateLimitRecord> = {};

/**
 * Rate limit check
 * @param key Unique key (like IP or user ID)
 * @param limit Max requests allowed
 * @param windowMs Time window in milliseconds
 */
export function rateLimit(key: string, limit = 50, windowMs = 60_000) {
  const now = Date.now();
  const record = rateLimitStore[key];

  if (!record) {
    // First request in this window
    rateLimitStore[key] = { count: 1, lastRequestTime: now };
    return { success: true };
  }

  const timeSinceFirstRequest = now - record.lastRequestTime;

  if (timeSinceFirstRequest > windowMs) {
    // Window expired → reset counter
    rateLimitStore[key] = { count: 1, lastRequestTime: now };
    return { success: true };
  }

  // Same window → increment
  record.count++;

  if (record.count > limit) {
    // Too many requests
    return {
      success: false,
      retryAfter: Math.ceil((windowMs - timeSinceFirstRequest) / 1000),
    };
  }

  return { success: true };
}
