import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { apiRouter } from './server/apiRouter';

dotenv.config();

async function startServer() {
  const app = express();
  const port = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Mount API router FIRST before any frontend middleware
  app.use('/api', apiRouter);

  // Catch all unmatched /api routes so they return JSON, NEVER HTML
  app.all('/api/*', (req, res) => {
    res.status(404).json({
      error: `API endpoint not found: ${req.method} ${req.originalUrl || req.url}`
    });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: port,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[ACCESSAI] Vite development middlewares mounted on Express.');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Express error handler to guarantee JSON for /api errors
  app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[ACCESSAI Server Error]:', err);
    if (req.path.startsWith('/api') || req.originalUrl?.startsWith('/api')) {
      res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        path: req.originalUrl || req.path
      });
      return;
    }
    res.status(500).send('Server Error');
  });

  app.listen(port, '0.0.0.0', () => {
    console.log(`ACCESSAI server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('[ACCESSAI] Fatal server startup failure:', err);
  process.exit(1);
});
