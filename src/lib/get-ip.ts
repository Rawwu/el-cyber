import { NextRequest } from "next/server";

export function getClientIp(request: NextRequest): string {
  // Try to get IP from various headers (for proxy/load balancer scenarios)
  const forwarded = request.headers.get("x-forwarded-for");
  const real = request.headers.get("x-real-ip");
  const cfConnecting = request.headers.get("cf-connecting-ip"); // Cloudflare
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  if (real) {
    return real;
  }
  
  if (cfConnecting) {
    return cfConnecting;
  }
  
  // Fallback to a default (localhost in development)
  return "127.0.0.1";
}