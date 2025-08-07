import { Hono } from 'hono';
import { getSession } from '../utils/auth';
import { Whisper } from '../types';

const whispers = new Hono<{ Bindings: Env }>();

// Middleware to check authentication
whispers.use('*', async (c, next) => {
  const session = await getSession(c.req.raw, c.env);
  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  (c as any).userId = session.userId;
  await next();
});

whispers.get('/', async (c) => {
  try {
    const userId = (c as any).userId;
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = parseInt(c.req.query('offset') || '0');
    const unreadOnly = c.req.query('unread_only') === 'true';

    let query = 'SELECT * FROM whispers WHERE to_user_id = ?';
    if (unreadOnly) {
      query += ' AND is_read = FALSE';
    }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

    const result = await c.env.DB.prepare(query)
      .bind(userId, limit, offset)
      .all<Whisper>();

    // Get unread count
    const unreadCount = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM whispers WHERE to_user_id = ? AND is_read = FALSE'
    ).bind(userId).first<{ count: number }>();

    return c.json({
      whispers: result.results,
      unread_count: unreadCount?.count || 0,
      total: result.results.length
    });
  } catch (error) {
    console.error('Get whispers error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

whispers.put('/:id/read', async (c) => {
  try {
    const userId = (c as any).userId;
    const whisperId = c.req.param('id');

    // Verify whisper belongs to user
    const whisper = await c.env.DB.prepare(
      'SELECT * FROM whispers WHERE id = ? AND to_user_id = ?'
    ).bind(whisperId, userId).first<Whisper>();

    if (!whisper) {
      return c.json({ error: 'Whisper not found' }, 404);
    }

    // Mark as read
    await c.env.DB.prepare(
      'UPDATE whispers SET is_read = TRUE WHERE id = ?'
    ).bind(whisperId).run();

    return c.json({ success: true });
  } catch (error) {
    console.error('Mark whisper read error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default whispers;