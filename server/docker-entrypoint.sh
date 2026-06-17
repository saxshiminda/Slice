#!/bin/sh
set -e

echo "Installing dependencies..."
npm install

echo "Running Prisma migrations..."
npx prisma migrate deploy
npx prisma generate

echo "Starting server..."
exec npx tsx watch src/index.ts
