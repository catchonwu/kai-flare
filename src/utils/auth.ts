import { JWTPayload } from '../types';

// Simple password hashing using Web Crypto API (for MVP - use proper library in production)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashedPassword = await hashPassword(password);
  return hashedPassword === hash;
}

// Simple JWT implementation for MVP
export function generateToken(userId: string, email: string, secret: string): string {
  const payload: JWTPayload = {
    userId,
    email,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days
  };
  
  // Simple encoding for MVP - use proper JWT library in production
  const data = btoa(JSON.stringify(payload));
  const signature = btoa(secret + data);
  return `${data}.${signature}`;
}

export function verifyToken(token: string, secret: string): JWTPayload | null {
  try {
    const [data, signature] = token.split('.');
    if (!data || !signature) return null;
    
    const expectedSignature = btoa(secret + data);
    if (signature !== expectedSignature) return null;
    
    const payload = JSON.parse(atob(data)) as JWTPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    
    return payload;
  } catch {
    return null;
  }
}

export async function getSession(request: Request, env: Env): Promise<JWTPayload | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const sessionData = await env.SESSIONS.get(token);
  
  if (!sessionData) {
    return null;
  }

  return verifyToken(token, env.JWT_SECRET);
}