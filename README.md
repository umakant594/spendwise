# SpendWise

SpendWise is a Vite/React frontend with an Express API, JWT authentication, and Prisma-backed PostgreSQL storage.

## Backend
```powershell
npm install
npm install --prefix server
npm run dev --prefix server
```

## Frontend
```powershell
npm install --prefix client
npm run dev --prefix client
```

The Vite development server proxies `/api` requests to the backend on port 5001. Configure PostgreSQL `DATABASE_URL` and `JWT_SECRET` in `server/.env` for local development. For local Vercel development, use `vercel env pull` and `vercel dev`.

## Deployment

The root Vercel project serves the built frontend and the Express API from a Node.js Function. Neon Postgres provides persistent storage. Vercel environment variables must include `DATABASE_URL` and `JWT_SECRET`; Prisma migrations are stored under `server/prisma/migrations`.
