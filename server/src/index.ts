import path from 'node:path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/error-handler.js';
import { ensureUploadDir } from './modules/upload/upload.service.js';
import { authRouter } from './modules/auth/auth.router.js';
import { categoryRouter, adminCategoryRouter } from './modules/category/category.router.js';
import { menuRouter, adminCakeRouter } from './modules/menu/menu.router.js';
import { inquiryRouter, adminInquiryRouter } from './modules/inquiry/inquiry.router.js';
import { orderRouter, adminOrderRouter } from './modules/order/order.router.js';
import { adminUploadRouter } from './modules/upload/upload.router.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(logger);

const uploadPath = ensureUploadDir();
app.use('/uploads', express.static(uploadPath));

app.get('/api/health', (_req, res) => {
  res.json({ data: { status: 'ok' } });
});

app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/cakes', menuRouter);
app.use('/api/inquiries', inquiryRouter);
app.use('/api/orders', orderRouter);

app.use('/api/admin/upload', adminUploadRouter);
app.use('/api/admin/categories', adminCategoryRouter);
app.use('/api/admin/cakes', adminCakeRouter);
app.use('/api/admin/inquiries', adminInquiryRouter);
app.use('/api/admin/orders', adminOrderRouter);

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
