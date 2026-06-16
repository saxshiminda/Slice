# Slice — Artisan Cake Portfolio Website

A production-quality bakery portfolio site built as a full-stack monorepo. Soft editorial luxury design language, six public pages, REST API, and Docker Compose for one-command startup.

## Stack

| Layer        | Technology                                                |
| ------------ | --------------------------------------------------------- |
| Frontend     | React 18 + Vite + TypeScript (strict)                     |
| Routing      | React Router v6                                           |
| Server state | TanStack Query (React Query v5)                           |
| UI state     | Zustand                                                   |
| Styling      | Tailwind CSS (custom design tokens, no component library) |
| Backend      | Node.js + Express + TypeScript (strict)                   |
| ORM          | Prisma                                                    |
| Database     | PostgreSQL 16                                             |
| Validation   | Zod (server schemas mirrored on client)                   |
| Infra        | Docker Compose (dev + production)                         |
| CI           | GitHub Actions                                            |

## Pages

| Route       | Description                                      |
| ----------- | ------------------------------------------------ |
| `/`         | Home — hero, featured cakes, brand story         |
| `/menu`     | Full menu with category filter, search, and sort |
| `/menu/:id` | Cake detail — full description and order CTA     |
| `/about`    | Brand story and values                           |
| `/contact`  | General enquiry form                             |
| `/order`    | Structured order request form                    |
| `*`         | Styled 404 page                                  |

## Project Structure

```
slice/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # UI primitives, layout, error boundary
│       ├── features/       # Feature-scoped folders (menu, contact, order)
│       ├── hooks/          # Shared custom hooks (fade-in, scroll-to-top)
│       ├── lib/            # API client, images, React Query setup
│       ├── pages/          # Route-level page components
│       ├── routes/         # React Router config
│       ├── store/          # Zustand stores
│       ├── styles/         # Tailwind global CSS
│       └── types/          # Shared TypeScript types
│   └── public/images/      # Local cake and site images (no hotlinks)
│
├── server/                 # Express + Prisma backend
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   └── src/
│       ├── config/         # env.ts — sole process.env reader
│       ├── lib/            # Prisma singleton
│       ├── middleware/     # error handler, logger, validate, auth placeholder
│       └── modules/
│           ├── menu/       # cakes API
│           └── inquiry/    # contact form API
│
├── scripts/
│   └── download-images.sh  # Fetch images into client/public/images/
├── .github/workflows/      # CI pipeline
├── docker-compose.yml      # Development (db + server + client)
├── docker-compose.prod.yml # Production (db + single app container)
├── Dockerfile.prod         # Multi-stage production build
├── .cursor/rules/          # Cursor AI coding rules
└── .env.example
```

## Quick Start (Docker — Development)

Requires Docker + Docker Compose.

```bash
# 1. Copy and review environment config
cp .env.example .env

# 2. Download local images (first time only)
npm run images

# 3. Start all three services (db, server, client)
docker compose up

# 4. In a new terminal, run migrations and seed
docker compose exec server npx prisma migrate deploy
docker compose exec server npm run db:seed
```

The client runs at **http://localhost:5173**, the API at **http://localhost:3001**.

## Production (Docker)

Single-container deployment — Express serves the built React app and API on one port.

```bash
cp .env.example .env
npm run dev:prod
# App available at http://localhost:3001

# Seed after first start (optional)
docker compose -f docker-compose.prod.yml exec app npx prisma db seed
```

The production image runs migrations automatically on startup. Set `CLIENT_URL` to your public URL in production.

## Local Development (without Docker)

You need Node.js 20+ and a local PostgreSQL instance.

```bash
# 1. Install root, client, and server dependencies
npm install
cd client && npm install
cd ../server && npm install

# 2. Copy env and set DATABASE_URL to your local Postgres
cp .env.example .env

# 3. Download images
npm run images

# 4. Run migrations
cd server && npm run db:migrate

# 5. Seed the database
npm run db:seed

# 6. Start the server (port 3001)
npm run dev

# 7. In a separate terminal, start the client (port 5173)
cd client && npm run dev
```

### Serving production build locally

```bash
npm run build
cd server
STATIC_DIR=../client/dist NODE_ENV=production npm start
# Open http://localhost:3001
```

## Environment Variables

| Variable       | Description                            | Default                                            |
| -------------- | -------------------------------------- | -------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string           | `postgresql://slice:slice@localhost:5432/slice_db` |
| `PORT`         | Express server port                    | `3001`                                             |
| `CLIENT_URL`   | CORS-allowed origin                    | `http://localhost:5173`                            |
| `NODE_ENV`     | Runtime environment                    | `development`                                      |
| `STATIC_DIR`   | Path to built client (production only) | unset                                              |
| `VITE_API_URL` | Client-side API base URL               | `http://localhost:3001`                            |

> When running via Docker Compose, `DATABASE_URL` uses `db` (the service name) as host instead of `localhost`.
>
> In production, leave `VITE_API_URL` empty so the client calls the API on the same origin.

## Scripts

### Root

| Script             | Description                                           |
| ------------------ | ----------------------------------------------------- |
| `npm run dev`      | Starts all services via `docker compose up`           |
| `npm run dev:prod` | Starts production stack via `docker-compose.prod.yml` |
| `npm run build`    | Builds client and server                              |
| `npm run lint`     | Runs ESLint across client and server                  |
| `npm run format`   | Runs Prettier across all files                        |
| `npm run images`   | Downloads cake/site images to `client/public/`        |

### Server (`cd server`)

| Script               | Description                                      |
| -------------------- | ------------------------------------------------ |
| `npm run dev`        | Start server with hot reload (tsx watch)         |
| `npm run build`      | Compile TypeScript to `dist/`                    |
| `npm run start`      | Run compiled server (`node dist/index.js`)       |
| `npm run db:migrate` | Run a new Prisma migration (dev)                 |
| `npm run db:deploy`  | Apply pending migrations (production/CI)         |
| `npm run db:seed`    | Seed the database with sample cakes (idempotent) |
| `npm run db:studio`  | Open Prisma Studio in the browser                |

### Client (`cd client`)

| Script          | Description           |
| --------------- | --------------------- |
| `npm run dev`   | Start Vite dev server |
| `npm run build` | Production build      |
| `npm run lint`  | Run ESLint            |

## API

Base URL: `http://localhost:3001`

All responses use the envelope format:

```json
{ "data": ..., "meta": { "total": 12 } }
```

| Method | Endpoint         | Description                                                    |
| ------ | ---------------- | -------------------------------------------------------------- |
| GET    | `/api/health`    | Health check                                                   |
| GET    | `/api/cakes`     | List available cakes. Query: `?category=Wedding&featured=true` |
| GET    | `/api/cakes/:id` | Single cake detail                                             |
| POST   | `/api/inquiries` | Submit a contact enquiry                                       |

### POST /api/inquiries body

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "message": "I am looking for a three-tier wedding cake for October..."
}
```

## Images

Cake and site images are stored locally in `client/public/images/` — no runtime dependency on external CDNs.

- Cake thumbnails: `client/public/images/cakes/{slug}.jpg`
- Site hero bands: `client/public/images/site/hero.jpg`, `inspo.jpg`
- Seed data references paths like `/images/cakes/grand-ivory-wedding.jpg`

To refresh images from source:

```bash
npm run images
docker compose exec server npm run db:seed   # update DB imageUrl values
```

## Design Tokens

| Token      | Value     | Usage                     |
| ---------- | --------- | ------------------------- |
| `warm`     | `#FAF7F4` | Page background           |
| `espresso` | `#1C1209` | Primary text              |
| `rose`     | `#D4967A` | Primary accent            |
| `sage`     | `#8A9E8C` | Secondary accent          |
| `cream`    | `#F2EDE7` | Card / surface background |

Fonts: **Cormorant Garamond** (display headings) + **DM Sans** (body text), loaded via Google Fonts.

## CI

GitHub Actions runs on push/PR to `main` or `master`:

1. `npm ci`
2. `npm run lint`
3. Prisma migrate deploy
4. Server and client production builds

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## Adding Auth

The auth middleware at `server/src/middleware/auth.ts` is a pass-through (`next()`) with a comment indicating where to add JWT verification. All routes that will require auth already import it. To add JWT auth:

1. Install `jsonwebtoken` and `@types/jsonwebtoken`
2. Replace the pass-through body in `auth.ts` with token verification logic
3. No route restructuring needed

## Adding Email (Resend)

The inquiry service at `server/src/modules/inquiry/inquiry.service.ts` has a marked TODO comment for a Resend mailer hook. After submission, install `resend` and call `resend.emails.send(...)` at that point.

## Database Migrations

Schema changes always go through Prisma migrations — never `prisma db push`:

```bash
cd server
npm run db:migrate  # dev: prompts for migration name
npm run db:deploy   # prod/Docker: applies pending migrations without prompts
```
