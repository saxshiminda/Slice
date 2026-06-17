import { existsSync } from 'node:fs';
import { config } from 'dotenv';
import { execSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const monorepoEnv = resolve(serverRoot, '../.env');
const serverEnv = resolve(serverRoot, '.env');

// Load root .env for local dev; skip overriding vars already set (e.g. Docker Compose).
if (existsSync(monorepoEnv)) {
  config({ path: monorepoEnv });
} else if (existsSync(serverEnv)) {
  config({ path: serverEnv });
}

const command = process.argv.slice(2).join(' ');
if (!command) {
  console.error('Usage: node scripts/run-with-env.mjs <command>');
  process.exit(1);
}

execSync(command, { stdio: 'inherit', env: process.env, cwd: serverRoot });
