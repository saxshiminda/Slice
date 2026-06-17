import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';
import type { Request, Response, NextFunction } from 'express';

const DEFAULTS = { id: 'singleton' as const, siteMode: 'both', siteName: 'Slice' };

async function get(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const config = (await prisma.siteConfig.findUnique({ where: { id: 'singleton' } })) ?? DEFAULTS;
    res.json({ data: config });
  } catch (err) {
    next(err);
  }
}

async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { siteMode, siteName } = req.body as { siteMode?: string; siteName?: string };
    const config = await prisma.siteConfig.upsert({
      where: { id: 'singleton' },
      create: { ...DEFAULTS, ...(siteMode && { siteMode }), ...(siteName && { siteName }) },
      update: { ...(siteMode && { siteMode }), ...(siteName && { siteName }) },
    });
    res.json({ data: config });
  } catch (err) {
    next(err);
  }
}

export const siteConfigRouter = Router();
siteConfigRouter.get('/', get);

export const adminSiteConfigRouter = Router();
adminSiteConfigRouter.use(auth);
adminSiteConfigRouter.get('/', get);
adminSiteConfigRouter.patch('/', update);
