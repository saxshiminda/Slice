import type { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service.js';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.login(req.body.username, req.body.password);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}
