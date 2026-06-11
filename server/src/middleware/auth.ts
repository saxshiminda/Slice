import type { Request, Response, NextFunction } from 'express';

/**
 * Placeholder auth middleware. Currently a pass-through.
 * Replace body with JWT verification logic when auth is added.
 */
export function auth(_req: Request, _res: Response, next: NextFunction): void {
  next();
}
