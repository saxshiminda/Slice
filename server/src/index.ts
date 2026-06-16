import path from 'node:path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/error-handler.js';
import { menuRouter } from './modules/menu/menu.router.js';
import { inquiryRouter } from './modules/inquiry/inquiry.router.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(logger);

app.get('/api/health', (_req, res) => {
  res.json({ data: { status: 'ok' } });
});

app.use('/api/cakes', menuRouter);
app.use('/api/inquiries', inquiryRouter);

if (env.staticDir) {
  const staticPath = path.resolve(env.staticDir);
  app.use(express.static(staticPath));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port} [${env.nodeEnv}]`);
});
