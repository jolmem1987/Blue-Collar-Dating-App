// Simple in-memory sliding-window limiter. Fine for a single-instance MVP.
// Swap for Upstash/Redis when you scale horizontally.
const hits = new Map<string, number[]>();

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= max) {
    hits.set(key, arr);
    return false; // blocked
  }
  arr.push(now);
  hits.set(key, arr);
  return true; // allowed
}
