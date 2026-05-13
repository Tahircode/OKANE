## OKANE 💳

A Scalable, Cache-Optimized Digital Wallet & P2P Payment Platform

OKANE is a full-stack digital wallet and peer-to-peer (P2P) payment application designed with scalability, performance, and financial correctness in mind.

It follows industry-grade backend patterns, uses Redis caching, and is structured as a Turborepo monorepo for clean separation of concerns.

## ✨ Features

### 🔐 Authentication & Authorization

1. Google OAuth
2. Credentials (NextAuth)

### 💰 Wallet System

1. Add money via bank webhook simulation
2. Maintain available & locked balances
3. ACID-compliant balance updates

### 🔁 P2P Transfers

1. Real-time balance transfers between users
2. Row-level locking to prevent race conditions
3. Transaction status tracking (Success | Failure | Processing)

### ⚡ Redis Caching (Upstash)
1. Cached balances, transaction history, user profiles
2. Cache invalidation on writes
3. On-demand cache warming
4. Scheduled cache warm-up via GitHub Actions

### 📦 Monorepo Architecture

1. Shared database & cache logic
2. Clear separation between frontend, backend, and workers

### 🐳 Dockerized Setup

Consistent local & production environments

### 🧠 Architecture Overview
```
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
```

**High-level Flow**

### User App (Next.js)

1. Handles UI, authentication, server actions
2. Reads from Redis first, falls back to DB

### Database Layer (PostgreSQL + Prisma)

1. Strong consistency for all financial operations
2. Transactions + row locking for correctness

### Cache Layer (Upstash Redis)
1. Read-heavy data served from Redis
2. Cache invalidated after writes
3. Cache warmed asynchronously

### Bank Webhook Service
1. Processes add-money requests ( using token based authentication)
2. Updates DB transactionally
3. Invalidates Redis cache

## 🛠 Tech Stack

### Frontend
1. Next.js (App Router)
2. TypeScript
3. Tailwind CSS
4. Heroicons

### Backend
1. Node.js
2. Express (bank-webhook)
3. NextAuth (authentication)

### Prisma ORM

1. Database & Cache
2. PostgreSQL

### Redis (Upstash)

### DevOps & Tooling
1. Turborepo
2. Docker & Docker Compose
2. GitHub Actions (scheduled cache warmer)

### Deployment

1. Vercel (user-app)
2. Render (bank-webhook)

## ⚙️ Setup & Installation

### 1. Clone the repository
```
git clone https://github.com/your-username/OKANE.git
cd OKANE
```
### 2. Install dependencies
```
npm install
```

### 3. Environment Variables

Each service requires its own environment variables.
```
cd apps/user-app/.env.local
```
add these env variables
```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```
```
cd apps/bank-webhook/.env
```
```
DATABASE_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

packages/db/.env
DATABASE_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### 4. Database setup
```
npm run db:generate
npm run db:migrate
```

### 5. Run locally
```
npm run dev
```

User app → http://localhost:3000

Bank webhook → http://localhost:3004

## 🧪 Cache Strategy
1. Read-first from Redis
2. Write-through to DB
3. Cache invalidation on mutation
4. On-demand cache warm-up
5. Scheduled warm-up (GitHub Actions)

### This reduces:
1. DB load
2. Cold-start latency
3. Expensive joins on frequent reads

### ⚠️ Errors & Lessons Learned

1. Handled Prisma transaction timeouts (P2028) by reducing transaction scope
2. Avoided race conditions using SELECT … FOR UPDATE
3. Ensured Redis failures do not block core DB operations
4. Fixed monorepo deployment issues using proper package exports
5. Solved Vercel workspace resolution for shared packages

## 🚀 Future Improvements
1. Idempotent webhook processing
2. WebSockets for real-time balance updates
3. Distributed locks for multi-instance writes
4. Rate limiting & fraud detection
5. Observability (metrics + tracing)
6. Background workers for heavy cache operations

## 📸 Screenshots / Diagrams



## 👤 Author

Tahir Aziz Khan

Final-year Engineer | Backend & Full-Stack Developer

Focused on scalable systems, caching strategies, and financial correctness

## ⭐ Final Note

This project is intentionally designed to reflect real-world backend engineering decisions, not just CRUD functionality.

If you’re reviewing this as a recruiter or engineer:

The emphasis is on correctness, performance, and architecture, not just features.
