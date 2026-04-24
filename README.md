# NewHostelWeb App

`NewHostelWeb` is a Vite + React + TypeScript frontend with a Hono + tRPC backend in the same project.

## Tech Stack

- Frontend: React 19, React Router, Tailwind CSS
- Backend: Hono, tRPC
- Database: MySQL + Drizzle ORM
- Build/Test: Vite, Vitest, ESLint, TypeScript

## Project Structure

```text
app/
  api/          # Hono + tRPC server
  src/          # React app
  db/           # Drizzle schema/migrations
  public/       # Static assets
```

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

1. Install dependencies:

```bash
npm ci
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Fill `.env` values as needed:

- `APP_ID`
- `APP_SECRET`
- `DATABASE_URL`
- `KIMI_AUTH_URL`
- `KIMI_OPEN_URL`
- `VITE_KIMI_AUTH_URL`
- `VITE_APP_ID`

## Run in Development

```bash
npm run dev
```

By default Vite uses `http://localhost:3000` (or the next available port).

## Common Commands

```bash
npm run dev         # start dev server
npm run build       # build frontend + backend bundle
npm run preview     # preview frontend build
npm run lint        # run eslint
npm run check       # run TypeScript checks
npm run test        # run tests
npm run format      # format files
```

## Database Commands

```bash
npm run db:generate
npm run db:migrate
npm run db:push
```

## Notes for Local Development

- If OAuth credentials are not configured, OAuth callback endpoints return a clear `503` message.
- Keep `.env` private. Never commit secrets.
