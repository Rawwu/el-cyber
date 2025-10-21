// In-memory rate limiter
interface RateLimitEntry {
    count: number;
    resetTime: number;
  }
  
  class RateLimiter {
    private requests: Map<string, RateLimitEntry> = new Map();
    private readonly maxRequests: number;
    private readonly windowMs: number;
  
    constructor(maxRequests: number = 5, windowMs: number = 60000) {
      this.maxRequests = maxRequests;
      this.windowMs = windowMs;
  
      // Clean up old entries every minute
      setInterval(() => this.cleanup(), 60000);
    }
  
    private cleanup() {
      const now = Date.now();
      for (const [key, entry] of this.requests.entries()) {
        if (now > entry.resetTime) {
          this.requests.delete(key);
        }
      }
    }
  
    check(identifier: string): { success: boolean; remaining: number; resetTime: number } {
      const now = Date.now();
      const entry = this.requests.get(identifier);
  
      if (!entry || now > entry.resetTime) {
        // First request or window has reset
        const resetTime = now + this.windowMs;
        this.requests.set(identifier, { count: 1, resetTime });
        return { success: true, remaining: this.maxRequests - 1, resetTime };
      }
  
      if (entry.count >= this.maxRequests) {
        // Rate limit exceeded
        return { success: false, remaining: 0, resetTime: entry.resetTime };
      }
  
      // Increment count
      entry.count++;
      this.requests.set(identifier, entry);
      return { success: true, remaining: this.maxRequests - entry.count, resetTime: entry.resetTime };
    }
  }
  
  // Create rate limiter instance
  // 5 requests per minute per IP
  export const commentRateLimiter = new RateLimiter(5, 60000);