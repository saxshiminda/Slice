import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from './app-error.js';
import { env } from '../config/env.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
    });
    return;
  }

  if (err instanceof Error && err.message.includes('image')) {
    res.status(400).json({ error: err.message });
    return;
  }

  // Unknown error — log internally, never expose stack in response
  console.error('[error]', err);
  res.status(500).json({
    error: env.nodeEnv === 'development' ? String(err) : 'Internal server error',
  });
}
