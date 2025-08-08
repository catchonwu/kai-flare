import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import auth from './routes/auth';
import thoughts from './routes/thoughts';
import whispers from './routes/whispers';
import lop from './routes/lop';

// @ts-ignore
import manifestJSON from '__STATIC_CONTENT_MANIFEST';

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
    const assetManifest = JSON.parse(manifestJSON);
    
    // Serve static assets from KV
    const response = await getAssetFromKV(
      {
        request: c.req.raw,
        waitUntil: (promise) => c.executionCtx.waitUntil(promise),
      },
      {
        ASSET_NAMESPACE: c.env.__STATIC_CONTENT,
        ASSET_MANIFEST: assetManifest,
        mapRequestToAsset: (request) => {
          const url = new URL(request.url);
          const pathname = url.pathname;
          
          // Skip API routes
          if (pathname.startsWith('/api/')) {
            return request;
          }
          
          // For files with extensions, serve as-is
          if (pathname.match(/\.[a-zA-Z0-9]+$/)) {
            return request;
          }
          
          // For SPA routes, serve index.html
          url.pathname = '/index.html';
          return new Request(url.toString(), request);
        },
      }
    );
    
    return response;
  } catch (e) {
    // Fallback to 404
    return c.text('Not Found', 404);
  }
});

// Error handler
app.onError((err, c) => {
  console.error('Application error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;