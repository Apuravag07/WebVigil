# Validator — `apps/validator`

Bun validator node for WebVigil. Connects to the Hub via WebSocket, receives URLs to check, pings them, measures latency, and signs the results with a Solana Ed25519 keypair before sending them back.

## Tech Stack

| Library | Purpose |
|---------|---------|
| Bun | Runtime |
| tweetnacl | Ed25519 message signing |
| @solana/web3.js | Solana keypair loading |

## Setup

### 1. Generate a Solana Keypair

> ⚠️ **This keypair represents your validator identity on the network.** Keep the private key secret. Never commit it to version control.

```bash
# Using Solana CLI
solana-keygen new --outfile keypair.json --no-bip39-passphrase

# View the public key
solana-keygen pubkey keypair.json

# The file will look like: [1, 2, 3, 4, ...]
cat keypair.json
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```env
# Paste the full JSON array from your keypair.json file
# Example: [1,23,45,67,...]
PRIVATE_KEY=[1,23,45,...]

# URL of the Hub WebSocket server
HUB_URL=ws://localhost:8081
```

> ⚠️ `keypair.json` is gitignored. Never add it to version control.

### 3. Run

```bash
cd apps/validator && bun run index.ts
```

The validator will:
1. Connect to the Hub at `ws://localhost:8081`
2. Sign a message and send a `signup` request
3. Receive `validate` tasks and ping each URL
4. Sign the result and send it back to the Hub

## How It Works

```
Validator boots
    │
    ▼
Connect to Hub (WebSocket)
    │
    ▼
Send signed `signup` message
    │
    ▼ (Hub replies with validatorId)
Wait for `validate` tasks
    │
    ▼
For each task:
  1. Fetch the URL (measure latency)
  2. Determine status: Good (200) or Bad (non-200 / error)
  3. Sign "Replying to <callbackId>" with Ed25519
  4. Send signed result back to Hub
```

## Signature Format

Signatures are sent as a JSON array of bytes (the raw Ed25519 signature):

```ts
const messageBytes = nacl_util.decodeUTF8("Replying to <callbackId>");
const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
const signedMessage = JSON.stringify(Array.from(signature));
```

The Hub verifies this against the validator's registered public key before persisting results.

## Running Multiple Validators

Each validator instance needs its **own unique keypair**. They all connect to the same Hub. The Hub distributes each validation task to **all** connected validators for redundancy.
