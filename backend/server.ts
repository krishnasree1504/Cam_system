import 'dotenv/config';

import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { authRouter } from './routes/auth';
import { storesRouter } from './routes/stores';
import { shelvesRouter } from './routes/shelves';
import { camerasRouter } from './routes/cameras';
import { usersRouter } from './routes/users';
import { dashboardRouter } from './routes/dashboard';
import { reportsRouter } from './routes/reports';
import { videoRouter } from './routes/video';
import { analyticsRouter } from './routes/analytics';

export async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mount API Routers
  app.use('/api/auth', authRouter);
  app.use('/api/stores', storesRouter);
  app.use('/api/shelves', shelvesRouter);
  app.use('/api/cameras', camerasRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/dashboard', dashboardRouter);
  app.use('/api/video', videoRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api', reportsRouter);

  // ZIP Source Code Download Endpoint
  app.get('/api/download-zip', (req: Request, res: Response) => {
    const zipPath = path.join(process.cwd(), 'cams-india-app.zip');
    res.download(zipPath, 'cams-india-app.zip', (err) => {
      if (err) {
        console.error('Error serving zip:', err);
        if (!res.headersSent) {
          res.status(500).json({ message: 'ZIP file not available' });
        }
      }
    });
  });

  // Healthcheck Endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Vite Middleware for dev / Static file serving for prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CAMS India App server running on http://localhost:${PORT}`);
  });
}
