import { Hono } from 'hono';
import { hashPassword, verifyPassword, generateToken } from '../utils/auth';
import { User, LOP_CHARACTERS } from '../types';

// Simple UUID v4 generation
function generateId(): string {
  return crypto.randomUUID();
}

const auth = new Hono<{ Bindings: Env }>();

auth.post('/register', async (c) => {
  try {
    const { email, password, lop_character } = await c.req.json();

    // Validate input
    if (!email || !password || !lop_character) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    if (!LOP_CHARACTERS.includes(lop_character)) {
      return c.json({ error: 'Invalid lop character' }, 400);
    }

    // Check if user already exists
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    if (existingUser) {
      return c.json({ error: 'User already exists' }, 409);
    }

    // Create new user
    const userId = generateId();
    const passwordHash = await hashPassword(password);
    const createdAt = Date.now();

    await c.env.DB.prepare(
      'INSERT INTO users (id, email, password_hash, lop_character, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(userId, email, passwordHash, lop_character, createdAt).run();

    // Generate token
    const token = generateToken(userId, email, c.env.JWT_SECRET);
    
    // Store session
    await c.env.SESSIONS.put(token, JSON.stringify({ userId, email }), {
      expirationTtl: 60 * 60 * 24 * 7 // 7 days
    });

    return c.json({
      token,
      user: {
        id: userId,
        email,
        lop_character,
        created_at: createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Find user
    const user = await c.env.DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email).first<User>();

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Verify password
    const validPassword = await verifyPassword(password, user.password_hash);
    if (!validPassword) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Generate token
    const token = generateToken(user.id, user.email, c.env.JWT_SECRET);
    
    // Store session
    await c.env.SESSIONS.put(token, JSON.stringify({ userId: user.id, email: user.email }), {
      expirationTtl: 60 * 60 * 24 * 7 // 7 days
    });

    return c.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        lop_character: user.lop_character,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default auth;