# Frontend — `apps/frontend`

Next.js 15 web dashboard for WebVigil. Provides the landing page and authenticated monitoring dashboard.

## Tech Stack

| Library | Purpose |
|---------|---------|
| Next.js 15 | React framework (App Router) |
| Clerk | Authentication (sign in / sign up / JWT) |
| TailwindCSS v4 | Styling |
| Axios | HTTP client for API calls |
| Lucide React | Icons |

## Setup

### 1. Install dependencies

From the repo root:
```bash
bun install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
# Get from https://dashboard.clerk.com → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Redirect paths after auth
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# API server URL
NEXT_PUBLIC_API_BACKEND_URL=http://localhost:8080
```

> ⚠️ Never commit `.env.local`. It is already gitignored.

### 3. Run in development

```bash
bun run dev
# or
cd apps/frontend && bun run dev
```

Runs on **http://localhost:3000**

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page (public) |
| `/dashboard` | Monitoring dashboard (requires auth via Clerk) |

## Project Structure

```
apps/frontend/
├── app/
│   ├── layout.tsx          # Root layout (Clerk, ThemeProvider, Appbar)
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Global styles + CSS variables
│   └── dashboard/
│       └── page.tsx        # Dashboard page
├── components/
│   ├── Appbar.tsx          # Top navigation bar
│   ├── theme-provider.tsx  # next-themes wrapper
│   └── ui/
│       └── button.tsx      # Reusable button component
├── hooks/
│   └── useWebsites.tsx     # Custom hook — fetches & polls website data
├── lib/
│   └── utils.ts            # Tailwind class helpers
├── config.ts               # API URL constant (from env)
└── next.config.ts
```

## Authentication

Authentication is handled by **Clerk**. The `useAuth()` hook provides `getToken()` which returns a short-lived JWT. This token is passed as the `Authorization` header to the API.

The API verifies this JWT using Clerk's RSA public key (`JWT_PUBLIC_KEY` env var on the API side).
