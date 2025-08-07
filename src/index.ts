import { Hono } from 'hono';
import { cors } from 'hono/cors';
import auth from './routes/auth';
import thoughts from './routes/thoughts';
import whispers from './routes/whispers';
import lop from './routes/lop';

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: Date.now() });
});

// Mount routes
app.route('/api/auth', auth);
app.route('/api/thoughts', thoughts);
app.route('/api/whispers', whispers);
app.route('/api/lop', lop);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Application error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;