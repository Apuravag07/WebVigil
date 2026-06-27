// ⚠️  NEVER hardcode secrets here. Use environment variables.
// Copy .env.example → .env and fill in the values.

if (!process.env.JWT_PUBLIC_KEY) {
  throw new Error("JWT_PUBLIC_KEY environment variable is not set. See .env.example");
}

export const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY.replace(/\\n/g, "\n");