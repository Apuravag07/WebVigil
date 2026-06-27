# API — `apps/api`

Express REST API for WebVigil. Handles all user-facing operations: creating monitors, fetching website status, and triggering validator payouts.

## Tech Stack

| Library | Purpose |
|---------|---------|
| Express 4 | HTTP server |
| Prisma | ORM (PostgreSQL) |
| jsonwebtoken | JWT verification (Clerk RS256 tokens) |
| cors | Cross-origin resource sharing |

## Setup

### 1. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```env
# Clerk JWT Public Key (RS256)
# Get from: Clerk Dashboard → API Keys → JWT Public Key
# Paste the full PEM, with literal \n between each line:
JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\nMIIBIj...\n-----END PUBLIC KEY-----

# PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/dpin_uptime
```

> ⚠️ The `JWT_PUBLIC_KEY` is a **public** key and not secret on its own, but using environment variables ensures you never accidentally commit credentials and makes rotation easy. Never hardcode it in source files.

### 2. Run

```bash
# From the repo root
bun run dev

# Or directly
cd apps/api && bun run index.ts
```

Runs on **http://localhost:8080**

## API Routes

All routes (except payouts) require a valid Clerk JWT in the `Authorization` header.

```
Authorization: <clerk_jwt_token>
```

---

### Websites

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/v1/website` | Add a new website to monitor |
| `GET` | `/api/v1/websites` | List all websites for the authenticated user |
| `GET` | `/api/v1/website/status?websiteId=<id>` | Get status + ticks for one website |
| `DELETE` | `/api/v1/website` | Soft-delete (disable) a website |

#### `POST /api/v1/website`
```json
// Body
{ "url": "https://example.com" }

// Response 201
{ "id": "uuid" }
```

#### `GET /api/v1/websites`
```json
// Response 200
{
  "websites": [
    {
      "id": "uuid",
      "url": "https://example.com",
      "userId": "user_xxx",
      "disabled": false,
      "ticks": [
        { "id": "uuid", "status": "Good", "latency": 142, "createdAt": "..." }
      ]
    }
  ]
}
```

#### `DELETE /api/v1/website`
```json
// Body
{ "websiteId": "uuid" }

// Response 200
{ "message": "Website deleted successfully" }
```

---

### Payouts

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/v1/payout/:validatorId` | Process pending payouts for a validator |

> Note: Actual Solana token transfers are not yet implemented. This endpoint resets `pendingPayouts` to 0 after recording the payout.

## Authentication Middleware

Every protected route passes through `authMiddleware`:

1. Reads `Authorization` header (Clerk JWT)
2. Verifies the JWT using the `JWT_PUBLIC_KEY` env var (RS256)
3. Attaches `req.userId` (the Clerk user ID) for downstream handlers
4. Returns `401` if token is missing or invalid
