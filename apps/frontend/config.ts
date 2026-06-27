// Backend API URL — set NEXT_PUBLIC_API_BACKEND_URL in your .env.local
// Falls back to localhost for local development only
export const API_BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:8080";