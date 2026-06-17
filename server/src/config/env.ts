import 'dotenv/config';

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  databaseUrl: requireEnv('DATABASE_URL'),
  port: parseInt(process.env['PORT'] ?? '3001', 10),
  clientUrl: process.env['CLIENT_URL'] ?? 'http://localhost:5173',
  nodeEnv: (process.env['NODE_ENV'] ?? 'development') as 'development' | 'production' | 'test',
  /** When set, Express serves the built client and SPA fallback (production). */
  staticDir: process.env['STATIC_DIR'],
  jwtSecret: process.env['JWT_SECRET'] ?? 'slice-dev-secret-change-in-production',
  adminUsername: process.env['ADMIN_USERNAME'] ?? 'admin',
  adminPassword: process.env['ADMIN_PASSWORD'] ?? '123',
  uploadDir: process.env['UPLOAD_DIR'] ?? 'uploads',
};
