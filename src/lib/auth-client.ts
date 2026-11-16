import { createAuthClient } from "better-auth/react";

// BetterAuth talks to the same Express backend as the REST fetches. Prefer a
// dedicated NEXT_PUBLIC_BETTER_AUTH_URL when provided, otherwise reuse
// NEXT_PUBLIC_API_URL, and finally fall back to localhost so `npm run dev`
// works with no .env file. The trailing slash is stripped so the client always
// joins paths as `<origin>/api/auth/...`, never `//api/auth/...`.
const baseURL = (
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

export const authClient = createAuthClient({
  baseURL,
});

export const { signIn, signUp, useSession, signOut, updateUser } = authClient;
