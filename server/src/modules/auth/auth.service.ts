import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { AppError } from '../../middleware/app-error.js';

export interface JwtPayload {
  sub: string;
  role: 'admin';
}

export function login(username: string, password: string) {
  if (username !== env.adminUsername || password !== env.adminPassword) {
    throw new AppError(401, 'Invalid username or password');
  }

  const token = jwt.sign({ sub: username, role: 'admin' } satisfies JwtPayload, env.jwtSecret, {
    expiresIn: '7d',
  });

  return { token, username };
}

export function verifyToken(token: string): JwtPayload {
  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
    if (payload.role !== 'admin') {
      throw new AppError(401, 'Unauthorized');
    }
    return payload;
  } catch {
    throw new AppError(401, 'Invalid or expired token');
  }
}
