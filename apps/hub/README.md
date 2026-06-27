# Hub — `apps/hub`

Bun WebSocket server that orchestrates the validator network. Runs every 60 seconds: reads all active websites from the database, broadcasts validate tasks to all connected validators, and stores the signed results.

## Tech Stack

| Library | Purpose |
|---------|---------|
| Bun | WebSocket server runtime |
| Prisma | ORM (PostgreSQL) |
| tweetnacl | Ed25519 signature verification (Solana) |
| @solana/web3.js | Solana public key parsing |

## Setup

### 1. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dpin_uptime
PORT=8081
```

### 2. Run

```bash
cd apps/hub && bun run index.ts
```

Runs WebSocket server on **ws://localhost:8081**

## WebSocket Protocol

The Hub and Validators communicate via JSON messages over WebSocket.

---

### Validator → Hub (Incoming)

#### `signup` — Register a validator node

```json
{
  "type": "signup",
  "data": {
    "ip": "1.2.3.4",
    "publicKey": "<solana_base58_public_key>",
    "callbackId": "<uuid>",
    "signedMessage": "<json_byte_array>"
  }
}
```

The `signedMessage` must be a valid Ed25519 signature of:
```
Signed message for <callbackId>, <publicKey>
```

#### `validate` — Return validation result

```json
{
  "type": "validate",
  "data": {
    "callbackId": "<uuid>",
    "status": "Good" | "Bad",
    "latency": 142,
    "websiteId": "<uuid>",
    "validatorId": "<uuid>",
    "signedMessage": "<json_byte_array>"
  }
}
```

The `signedMessage` must be a valid Ed25519 signature of:
```
Replying to <callbackId>
```

---

### Hub → Validator (Outgoing)

#### `signup` — Confirm validator registration

```json
{
  "type": "signup",
  "data": {
    "validatorId": "<uuid>",
    "callbackId": "<uuid>"
  }
}
```

#### `validate` — Request URL validation

```json
{
  "type": "validate",
  "data": {
    "url": "https://example.com",
    "callbackId": "<uuid>",
    "websiteId": "<uuid>"
  }
}
```

---

## Security

- Every validator must sign its signup and validation messages with its Solana Ed25519 private key
- The Hub verifies all signatures before storing any data
- Invalid signatures are silently dropped — no data is persisted
