# SpendWise

Current completed milestone: Step 1 — finance dashboard, JWT login, Prisma/SQLite, seeded demo data, accounts, transactions and budgets API.

Demo login:
- Email: admin@spendwise.com
- Password: demo_password

## Backend
```powershell
cd server
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```
Runs on http://localhost:5001

## Frontend
```powershell
cd client
npm install
npm run dev
```
Runs on http://localhost:5173

## Important
Run `npm run seed` once before logging in. It creates the demo user and sample data.

Next major steps:
2. Transactions + Accounts
3. Budgets + Analytics
4. Authentication + Settings + Polish
5. Production check + portfolio/GitHub packaging
