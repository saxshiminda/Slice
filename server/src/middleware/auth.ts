import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../modules/auth/auth.service.js';
import { AppError } from './app-error.js';

export function auth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(new AppError(401, 'Unauthorized'));
    return;
  }

  try {
    const payload = verifyToken(header.slice(7));
    req.user = { username: payload.sub };
    next();
  } catch (err) {
    next(err);
  }
}
