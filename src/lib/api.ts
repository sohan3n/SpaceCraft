// Single source of truth for the Express backend origin used by every
// client-side REST fetch in the app.
//
// - NEXT_PUBLIC_* variables are inlined at build time by Next.js, so this
//   works in both client components and server components.
// - The localhost fallback keeps `npm run dev` working with no .env file.
// - The trailing-slash strip guarantees `${API_BASE_URL}/api/...` never
//   collapses into `//api/...` when the env var is set with a trailing slash.
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");
