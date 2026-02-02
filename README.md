OKANE 💳

A Scalable, Cache-Optimized Digital Wallet & P2P Payment Platform

- OKANE is a full-stack digital wallet and peer-to-peer (P2P) payment application designed with scalability, performance, and financial correctness in mind.
It follows industry-grade backend patterns, uses Redis caching, and is structured as a Turborepo monorepo for clean separation of concerns.

✨ Features

🔐 Authentication & Authorization

- Google OAuth

- Credentials (NextAuth)

💰 Wallet System

- Add money via bank webhook simulation

- Maintain available & locked balances

- ACID-compliant balance updates

🔁 P2P Transfers

- Real-time balance transfers between users

- Row-level locking to prevent race conditions

- Transaction status tracking (Success | Failure | Processing)

⚡ Redis Caching (Upstash)

- Cached balances, transaction history, user profiles

- Cache invalidation on writes

- On-demand cache warming

- Scheduled cache warm-up via GitHub Actions

📦 Monorepo Architecture

Shared database & cache logic

Clear separation between frontend, backend, and workers

🐳 Dockerized Setup

Consistent local & production environments

🧠 Architecture Overview
OKANE (Turborepo)
│
├── apps/
│   ├── user-app        → Next.js frontend + server actions (Vercel)
│   └── bank-webhook    → Express webhook service (Render)
│
├── packages/
│   ├── db              → Prisma, PostgreSQL, Redis cache layer
│   └── ui              → Shared UI components
│
└── docker-compose.yml

High-level Flow

User App (Next.js)

Handles UI, authentication, server actions

Reads from Redis first, falls back to DB

Database Layer (PostgreSQL + Prisma)

Strong consistency for all financial operations

Transactions + row locking for correctness

Cache Layer (Upstash Redis)

Read-heavy data served from Redis

Cache invalidated after writes

Cache warmed asynchronously

Bank Webhook Service

Processes add-money requests

Updates DB transactionally

Invalidates Redis cache

🛠 Tech Stack
Frontend

Next.js (App Router)

TypeScript

Tailwind CSS

Heroicons

Backend

Node.js

Express (bank-webhook)

NextAuth (authentication)

Prisma ORM

Database & Cache

PostgreSQL

Redis (Upstash)

DevOps & Tooling

Turborepo

Docker & Docker Compose

GitHub Actions (scheduled cache warmer)

Vercel (user-app)

Render (bank-webhook)

⚙️ Setup & Installation
1️⃣ Clone the repository
git clone https://github.com/your-username/OKANE.git
cd OKANE

2️⃣ Install dependencies
npm install

3️⃣ Environment Variables

Each service requires its own environment variables.

apps/user-app/.env.local
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

apps/bank-webhook/.env
DATABASE_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

packages/db/.env
DATABASE_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

4️⃣ Database setup
npm run db:generate
npm run db:migrate

5️⃣ Run locally
npm run dev


User app → http://localhost:3000

Bank webhook → http://localhost:3004

🧪 Cache Strategy

Read-first from Redis

Write-through to DB

Cache invalidation on mutation

On-demand cache warm-up

Scheduled warm-up (GitHub Actions)

This reduces:

DB load

Cold-start latency

Expensive joins on frequent reads

⚠️ Errors & Lessons Learned

Handled Prisma transaction timeouts (P2028) by reducing transaction scope

Avoided race conditions using SELECT … FOR UPDATE

Ensured Redis failures do not block core DB operations

Fixed monorepo deployment issues using proper package exports

Solved Vercel workspace resolution for shared packages

🚀 Future Improvements

Idempotent webhook processing

WebSockets for real-time balance updates

Distributed locks for multi-instance writes

Rate limiting & fraud detection

Observability (metrics + tracing)

Background workers for heavy cache operations

📸 Screenshots / Diagrams

(You can add architecture diagrams or UI screenshots here later)

👤 Author

Tahir Aziz Khan
Final-year Engineer | Backend & Full-Stack Developer
Focused on scalable systems, caching strategies, and financial correctness

⭐ Final Note

This project is intentionally designed to reflect real-world backend engineering decisions, not just CRUD functionality.

If you’re reviewing this as a recruiter or engineer:

The emphasis is on correctness, performance, and architecture, not just features.
