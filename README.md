# OKANE 💳

A Scalable, Cache-Optimized Digital Wallet & P2P Payment Platform

- OKANE is a full-stack digital wallet and peer-to-peer (P2P) payment application designed with scalability, performance, and financial correctness in mind.

- The system follows industry-grade backend patterns, leverages Redis caching, and is structured as a Turborepo monorepo to enable clean separation of concerns and independent scalability.

 ## 📚 Table of Contents

- ✨ Features
 
- 🧠 Architecture Overview
 
- 🔄 High-Level Flow

- 🛠 Tech Stack
 
- 🚀 CI/CD & Automation
 
- ⚙️ Setup & Installation
 
- 🧠 Cache Strategy
 
- ⚠️ Errors & Lessons Learned
 
- 🚀 Future Improvements
 
- 👤 Author
 
- ⭐ Final Note
 
## ✨ Features
 
#### 🔐 Authentication & Authorization

- Google OAuth
- Credentials-based login using NextAuth

#### 💰 Wallet System

- Add money via simulated bank webhook
- Maintain available and locked balances
- ACID-compliant balance updates
 
#### 🔁 P2P Transfers

- Real-time balance transfers between users
- Row-level locking to prevent race conditions
- Transaction status tracking (Success | Failure | Processing)
  
#### ⚡ Redis Caching (Upstash)

- Cached balances, transaction history, and user profiles
- Cache invalidation on write operations
- On-demand cache warming
- Scheduled cache warm-up using GitHub Actions

#### 📦 Monorepo Architecture

- Shared database & cache layer
- Clear separation between frontend, backend, and workers
  
#### 🐳 Dockerized Setup

- Fully Dockerized services
- Consistent local, staging, and production environments
  
#### 🧠 Architecture Overview

```text
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

## 🔄 High-Level Flow

#### User App (Next.js)

Handles UI, authentication, and server actions
Reads from Redis first, falls back to the database
Database Layer (PostgreSQL + Prisma)
Strong consistency for all financial operations
Transactions + row-level locking for correctness

#### Cache Layer (Upstash Redis)
 
Redis-first architecture for high-frequency reads, Write-through cache invalidation to maintain data correctness, Asynchronous cache warming for hot paths
Hourly automated cache-warming pipeline powered by GitHub Actions to keep Redis hot and minimize DB pressure

#### Bank Webhook Service
Express.js microservice (bankHook) handles webhook verifications, specialized payment logic and Invalidates Redis cache

## 🛠 Tech Stack

<table>
  <tr>
    <th>Category</th>
    <th>Technology</th>
    <th>Use Case</th>
  </tr>

  <!-- Frontend -->
  <tr>
    <td rowspan="4" valign="middle"><strong>Frontend</strong></td>
    <td>
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="30"/>
      <a href="https://nextjs.org/"> Next.js</a> (App Router)
    </td>
    <td>React Framework</td>
  </tr>
  <tr>
    <td>
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="30"/>
      <a href="https://www.typescriptlang.org/"> TypeScript</a>
    </td>
    <td>Type-safe JavaScript</td>
  </tr>
  <tr>
    <td>
     <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" width="30"/>
      <a href="https://tailwindcss.com/"> Tailwind CSS</a>
    </td>
    <td>Utility-first CSS</td>
  </tr>
  <tr>
    <td>
      <img src="https://skillicons.dev/icons?i=react" width="26"/>
      <a href="https://heroicons.com/"> React Icons</a>
    </td>
    <td>UI Icons</td>
  </tr>

  <!-- Backend -->
  <tr>
    <td rowspan="4" valign="middle"><strong>Backend</strong></td>
    <td>
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="26"/>
      <a href="https://nodejs.org/"> Node.js</a>
    </td>
    <td>JavaScript Runtime</td>
  </tr>
  <tr>
    <td>
      <img src="https://skillicons.dev/icons?i=express" width="26"/>
      <a href="https://expressjs.com/"> Express</a> (bank-webhook)
    </td>
    <td>Web Framework</td>
  </tr>
  <tr>
    <td>
      <img src="https://authjs.dev/img/logo-sm.png" width="24" />
      <a href="https://next-auth.js.org/"> NextAuth</a>
    </td>
    <td>Authentication</td>
  </tr>
  <tr>
    <td>
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg" width="26"/>
      <a href="https://www.prisma.io/"> Prisma ORM</a>
    </td>
    <td>Database Client & Migrations</td>
  </tr>

  <!-- Database & Cache -->
  <tr>
    <td rowspan="2" valign="middle"><strong>Database & Cache</strong></td>
    <td>
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="26"/>
      <a href="https://www.postgresql.org/"> PostgreSQL</a>
    </td>
    <td>Primary Database</td>
  </tr>
  <tr>
    <td>
     <img src="https://skillicons.dev/icons?i=redis" width="26"/>
      <a href="https://redis.io/"> Redis</a> (Upstash)
    </td>
    <td>In-memory Cache</td>
  </tr>

  <!-- DevOps -->
  <tr>
    <td rowspan="5" valign="middle"><strong>DevOps & Tooling</strong></td>
    <td>
      <img src="https://cdn.simpleicons.org/turborepo/000000" width="26"/>
      <a href="https://turbo.build/"> Turborepo</a>
    </td>
    <td>Monorepo Tooling</td>
  </tr>
  <tr>
    <td>
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="26"/>
      <a href="https://www.docker.com/"> Docker</a>
    </td>
    <td>Containerization</td>
  </tr>
  <tr>
    <td>
      <img src="https://skillicons.dev/icons?i=githubactions" width="26"/>
      <a href="https://github.com/features/actions"> GitHub Actions</a>
    </td>
    <td>CI/CD & Automation</td>
  </tr>
  <tr>
    <td>
      <img src="https://skillicons.dev/icons?i=vercel" width="26"/>
      <a href="https://vercel.com/"> Vercel</a> (user-app)
    </td>
    <td>Frontend Deployment</td>
  </tr>
  <tr>
    <td>
      <img src="https://cdn.simpleicons.org/render/46E3B7" width="26"/>
      <a href="https://render.com/"> Render</a> (bank-webhook)
    </td>
    <td>Backend Deployment</td>
  </tr>
</table>



## 🚀 CI/CD & Automation

- This project uses GitHub Actions to automate build, deployment, and operational workflows.

#### 🔁 Continuous Integration

- Validates builds across the monorepo
- Ensures TypeScript compilation and Prisma client generation
- Prevents broken code from reaching production

#### 🐳 Docker-Based Deployment

- Docker images built for backend services
- Enables consistent deployments across environments
- Simplifies local development and cloud deployment

#### ♨️ Redis Cache Warmer (Scheduled Job)

- A scheduled GitHub Actions workflow runs periodically
- Executes a cache-warming script that:
  - Preloads balances, profiles, contacts, and transaction history into Redis
  - Reduces cold-start latency and database load
- Can also be triggered manually from the GitHub UI

#### 🔐 Secure Configuration

- All sensitive values are managed via GitHub Secrets
No credentials are hard-coded

## ⚙️ Setup & Installation

#### Prerequisites:

- **Node.js** ≥ 20  
- **PostgreSQL** ≥ 14  
- **Redis** ≥ 7  
- **Docker** *(optional but recommended)*
  
#### 1️⃣ Clone the repository

bash
```text
git clone https://github.com/your-username/OKANE.git
cd OKANE
```
#### 2️⃣ Install dependencies

bash
```text
npm install
```

#### 3️⃣ Environment Variables
- Each service uses its own environment file.
- setup environment variables
1. create .env file for user-app
- bash
```text
cd apps/user-app
touch .env.local
```

- create
```text
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```
2. create .env file for bank-webhook
```text
cd ../../apps/bank-webhook
touch .env
```
- create
```text
DATABASE_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```
3. create .env file packages/db
```text
cd ../../packages/db
touch .env
```
- create
```text
DATABASE_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

#### 4️⃣ Database setup

bash
```text
npm run db:generate
npm run db:migrate
```

5️⃣ Run locally

bash
```text
cd ../../
npm run dev
```

User App → http://localhost:3000

Bank Webhook → http://localhost:3004



## 🧠 Cache Strategy

- Read-first from Redis
- Write-through to PostgreSQL
- Cache invalidation on mutation
- On-demand cache warming
- Scheduled cache warming via GitHub Actions
  
#### Benefits:

- Reduced database load
- Lower latency
- Faster cold starts
- Fewer expensive joins on hot paths
  
## ⚠️ Errors & Lessons Learned
- Resolved Prisma transaction timeouts (P2028) by reducing transaction scope.
- Prevented race conditions using SELECT … FOR UPDATE.
- Ensured Redis failures never block core database operations.
- Fixed monorepo deployment issues with proper package exports.
- Solved Vercel workspace resolution for shared packages.
  
## 🚀 Future Improvements
- Idempotent webhook processing
- WebSockets for real-time balance updates
- Distributed locks for multi-instance writes
- Rate limiting & fraud detection
- Observability (metrics + tracing)
- Dedicated background workers for heavy cache operations
  
## 👤 Author
- Tahir Aziz Khan
  - Final-year Engineer | Backend & Full-Stack Developer
  - Focused on scalable systems, caching strategies, and financial correctness.

## ⭐ Final Note
- This project is intentionally designed to reflect real-world backend engineering decisions, not just CRUD functionality.

- The emphasis is on correctness, performance, and architecture, not just features.
