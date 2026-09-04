import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Helper to start auxiliary static servers for microfrontends with CORS enabled
 */
function startMicrofrontendServer(
  port: number,
  distPath: string,
  name: string,
) {
  if (!existsSync(distPath)) {
    return;
  }
  const mfeApp = express();
  mfeApp.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });
  mfeApp.use(
    express.static(distPath, {
      maxAge: '1y',
      index: 'index.html',
    }),
  );

  const server = mfeApp.listen(port, () => {
    console.log(`[SSR Cluster] ${name} served on http://localhost:${port}`);
  });
  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log(
        `[SSR Cluster] Port ${port} is already active (using existing ${name} instance).`,
      );
    } else {
      console.error(`[SSR Cluster] Error on port ${port}:`, err);
    }
  });
}

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error?: any) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);

    // Auto-host microfrontends if compiled bundles are present in dist/
    const mfeEventsDist = join(
      import.meta.dirname,
      '../../mfe-events/browser',
    );
    const mfeBookingDist = join(
      import.meta.dirname,
      '../../mfe-booking/browser',
    );

    startMicrofrontendServer(4201, mfeEventsDist, 'mfe-events');
    startMicrofrontendServer(4202, mfeBookingDist, 'mfe-booking');
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
