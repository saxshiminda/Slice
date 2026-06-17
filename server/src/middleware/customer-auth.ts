import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

interface CustomerJwtPayload {
  customerId: string;
  email: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      customerId?: string;
      customerEmail?: string;
    }
  }
}

/** Attaches customer identity if a valid customer JWT is present; never blocks. */
export function optionalCustomerAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers['authorization'];
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) {
    next();
    return;
  }

  try {
    const payload = jwt.verify(token, env.customerJwtSecret) as CustomerJwtPayload;
    req.customerId = payload.customerId;
    req.customerEmail = payload.email;
  } catch {
    // Invalid/expired token — treat as guest
  }

  next();
}

/** Blocks requests without a valid customer JWT. */
export function requireCustomerAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers['authorization'];
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const payload = jwt.verify(token, env.customerJwtSecret) as CustomerJwtPayload;
    req.customerId = payload.customerId;
    req.customerEmail = payload.email;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
