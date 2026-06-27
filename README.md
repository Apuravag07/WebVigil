<div align="center">

<img src="https://img.shields.io/badge/status-active-brightgreen?style=flat-square" />
<img src="https://img.shields.io/badge/stack-Next.js%20%7C%20Express%20%7C%20Bun%20%7C%20Prisma-7c3aed?style=flat-square" />
<img src="https://img.shields.io/badge/auth-Clerk-6c47ff?style=flat-square" />
<img src="https://img.shields.io/badge/blockchain-Solana-9945ff?style=flat-square" />
<img src="https://img.shields.io/badge/db-PostgreSQL-336791?style=flat-square" />

# ⚡ WebVigil

**Decentralized website uptime monitoring powered by a global validator network.**

Monitor your websites every 60 seconds from independent validators — no central authority, cryptographically-signed results, instant alerts.

</div>

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────┐
│                     User / Browser                  │
│              (Next.js Frontend + Clerk Auth)        │
└────────────────────────┬────────────────────────────┘
                         │ REST API
              ┌──────────▼──────────┐
              │    Express API      │  ← apps/api  (port 8080)
              │  + Prisma (PG)      │
              └──────────┬──────────┘
                         │ PostgreSQL
              ┌──────────▼──────────┐
              │    PostgreSQL DB    │  ← packages/db
              └─────────────────────┘

┌─────────────────────────────────────────────────────┐
│              Hub (Bun WebSocket Server)             │  ← apps/hub (port 8081)
│   Distributes validation tasks every 60 seconds    │
└──────┬──────────────────────────────────────┬───────┘
       │ WebSocket                            │ WebSocket
┌──────▼──────┐                      ┌───────▼──────┐
│  Validator  │  ...                 │  Validator N │  ← apps/validator
│  Node 1     │                      │  Node N      │
└─────────────┘                      └──────────────┘
```

**Flow:**
1. Users add websites via the **Frontend** → stored in **PostgreSQL** via the **API**
2. The **Hub** reads all active websites every 60s and broadcasts validate tasks to all connected **Validators** via WebSocket
3. **Validators** ping the URLs, measure latency, sign their response with a Solana keypair, and send results back
4. The **Hub** verifies signatures and stores results in the database
5. The **Frontend** polls the API to display uptime history and status

---

## 🗂 Monorepo Structure

```
webvigil/
├── apps/
│   ├── frontend/      # Next.js 15 web dashboard (Clerk auth, TailwindCSS)
│   ├── api/           # Express REST API (Prisma + PostgreSQL)
│   ├── hub/           # Bun WebSocket hub (distributes tasks to validators)
│   └── validator/     # Bun validator node (pings URLs, signs results)
├── packages/
│   ├── db/            # Prisma client + schema (shared across apps)
│   ├── common/        # Shared TypeScript types
│   ├── ui/            # Shared React components
│   ├── eslint-config/ # Shared ESLint configuration
│   └── typescript-config/ # Shared tsconfig base
├── .gitignore
├── package.json       # Root workspaces config (Turborepo + bun)
└── turbo.json
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| [Bun](https://bun.sh) | ≥ 1.2 | Package manager + runtime |
| [Node.js](https://nodejs.org) | ≥ 18 | Frontend (Next.js) |
| [PostgreSQL](https://postgresql.org) | ≥ 14 | Database |
| [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) | any | Generate validator keypairs |

### 1. Clone & Install

```bash
git clone https://github.com/Apuravag07/WebVigil.git
cd WebVigil
bun install
```

### 2. Set Up Environment Variables

Each app has its own `.env.example`. Copy and fill each one:

```bash
# API
cp apps/api/.env.example         apps/api/.env

# Frontend
cp apps/frontend/.env.example    apps/frontend/.env.local

# Hub
cp apps/hub/.env.example         apps/hub/.env

# Validator
cp apps/validator/.env.example   apps/validator/.env
```

> See each app's README for what values to fill in.

### 3. Set Up the Database

```bash
# Apply migrations
cd packages/db
bunx prisma migrate dev --name init

# (Optional) Seed sample data
bunx prisma db seed
```

### 4. Run All Services

```bash
# From the repo root — starts all apps in dev mode
bun run dev
```

Or run each app individually:

| App | Command | Port |
|-----|---------|------|
| Frontend | `cd apps/frontend && bun run dev` | 3000 |
| API | `cd apps/api && bun run index.ts` | 8080 |
| Hub | `cd apps/hub && bun run index.ts` | 8081 |
| Validator | `cd apps/validator && bun run index.ts` | — |

---

## 🔑 Environment Variables Summary

| App | Required Variables |
|-----|--------------------|
| `api` | `JWT_PUBLIC_KEY`, `DATABASE_URL` |
| `frontend` | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_API_BACKEND_URL` |
| `hub` | `DATABASE_URL` |
| `validator` | `PRIVATE_KEY` (Solana keypair JSON array) |

> ⚠️ **Never commit `.env` files.** Only `.env.example` files should be in version control.

---

## 🗄 Database Schema

```
User          — id, email
Website       — id, url, userId, disabled
Validator     — id, publicKey, location, ip, pendingPayouts
WebsiteTick   — id, websiteId, validatorId, createdAt, status (Good|Bad), latency
```

---

## 🔐 Security

- **Validator signatures**: All validator results are signed with a Solana Ed25519 keypair and verified by the Hub before being stored. This prevents fake data injection.
- **JWT auth**: The API uses Clerk-issued JWTs (RS256) to authenticate all user requests. The public key is loaded from an environment variable — never hardcoded.
- **Private keys**: Validator private keys are loaded only from environment variables (`.env`). Keypair files (`*.json`) are gitignored globally.

---

## 🛣 Roadmap

- [ ] Slack / Discord / webhook alert integrations
- [ ] Email alert digests
- [ ] Solana on-chain payouts to validators
- [ ] Multi-region dashboard with map view
- [ ] Public status page per website
- [ ] Validator reputation scoring

---

## 🤝 Contributing

1. Fork the repo
2. Create your branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to the branch (`git push origin feat/your-feature`)
5. Open a Pull Request

---

## 📄 License

MIT © WebVigil
