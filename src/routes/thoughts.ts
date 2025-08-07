import { Hono } from 'hono';
import { getSession } from '../utils/auth';
import { analyzeSentiment, generateWhisperMessage } from '../utils/sentiment';
import { Thought } from '../types';

const thoughts = new Hono<{ Bindings: Env }>();

// Middleware to check authentication
thoughts.use('*', async (c, next) => {
  const session = await getSession(c.req.raw, c.env);
  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  (c as any).userId = session.userId;
  await next();
});

thoughts.post('/', async (c) => {
  try {
    const userId = (c as any).userId;
    const { content } = await c.req.json();

    if (!content || content.trim().length === 0) {
      return c.json({ error: 'Content is required' }, 400);
    }

    // Analyze sentiment
    const sentiment = analyzeSentiment(content);
    const thoughtId = crypto.randomUUID();
    const createdAt = Date.now();

    // Save thought
    await c.env.DB.prepare(
      'INSERT INTO thoughts (id, user_id, content, sentiment, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(thoughtId, userId, content, sentiment, createdAt).run();

    // Trigger whisper matching
    await createWhisperForThought(c.env, userId as string, sentiment);

    return c.json({
      id: thoughtId,
      content,
      sentiment,
      created_at: createdAt
    });
  } catch (error) {
    console.error('Create thought error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

thoughts.get('/', async (c) => {
  try {
    const userId = (c as any).userId;
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = parseInt(c.req.query('offset') || '0');

    const result = await c.env.DB.prepare(
      'SELECT * FROM thoughts WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
    ).bind(userId, limit, offset).all<Thought>();

    return c.json({
      thoughts: result.results,
      total: result.results.length
    });
  } catch (error) {
    console.error('Get thoughts error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Helper function to create whispers
async function createWhisperForThought(env: Env, senderId: string, sentiment: string) {
  try {
    // Find users with opposite sentiment who might benefit from encouragement
    const targetSentiment = sentiment === 'positive' ? 'negative' : 
                          sentiment === 'negative' ? 'positive' : 
                          'neutral';
    
    // Get recent users who shared thoughts with target sentiment
    const targetUsers = await env.DB.prepare(`
      SELECT DISTINCT user_id 
      FROM thoughts 
      WHERE sentiment = ? 
      AND user_id != ? 
      AND created_at > ?
      ORDER BY RANDOM() 
      LIMIT 5
    `).bind(
      targetSentiment,
      senderId,
      Date.now() - (24 * 60 * 60 * 1000) // Last 24 hours
    ).all();

    if (targetUsers.results.length > 0) {
      // Select random target user
      const targetUser = targetUsers.results[Math.floor(Math.random() * targetUsers.results.length)];
      const whisperId = crypto.randomUUID();
      const message = generateWhisperMessage(sentiment as any);
      
      // Create whisper
      await env.DB.prepare(
        'INSERT INTO whispers (id, to_user_id, message, sentiment_match, created_at, is_read) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(
        whisperId,
        targetUser.user_id,
        message,
        `${sentiment}->${targetSentiment}`,
        Date.now(),
        false
      ).run();
    }
  } catch (error) {
    console.error('Create whisper error:', error);
    // Don't throw - whisper creation failure shouldn't fail thought creation
  }
}

export default thoughts;