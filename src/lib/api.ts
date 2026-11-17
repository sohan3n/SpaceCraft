// Single source of truth for the REST API origin used by every
// client-side REST fetch in the app.
//
// The backend lives on a separate *.vercel.app domain, which the browser
// treats as a different site (Public Suffix List), so cross-site requests
// would have their cookies blocked. Every fetch therefore stays on this
// app's own origin: the relative `/api/...` paths are proxied to the
// Express backend by the first-party rewrite in `next.config.ts`.
//
// - Works in both client and server components (relative URLs are resolved
//   by the browser against the current origin).
// - Keeps `npm run dev` working with no .env file: the rewrite falls back
//   to http://localhost:5000 when no backend URL is configured.
// - The empty string keeps every existing call site —
//   `${API_BASE_URL}/api/...` — producing a same-origin path unchanged.
export const API_BASE_URL = "";
