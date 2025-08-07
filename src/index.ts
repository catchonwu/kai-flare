import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getAssetFromKV, serveSinglePageApp } from '@cloudflare/kv-asset-handler';
import auth from './routes/auth';
import thoughts from './routes/thoughts';
import whispers from './routes/whispers';
import lop from './routes/lop';

const app = new Hono<{ Bindings: Env }>();

// CORS middleware for API routes only
app.use('/api/*', cors({
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

// Handle static assets and SPA routing
app.get('*', async (c) => {
  try {
    // Serve static assets from KV
    return await getAssetFromKV(
      {
        request: c.req.raw,
        waitUntil(promise) {
          return c.executionCtx.waitUntil(promise);
        },
      },
      {
        mapRequestToAsset: serveSinglePageApp,
        cacheControl: {
          browserTTL: 60 * 60 * 24 * 365, // 1 year
          edgeTTL: 60 * 60 * 24 * 365, // 1 year
          bypassCache: false,
        },
      }
    );
  } catch (e) {
    // If asset not found, return 404
    return c.notFound();
  }
});

// Error handler
app.onError((err, c) => {
  console.error('Application error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;