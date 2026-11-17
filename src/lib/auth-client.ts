import { createAuthClient } from "better-auth/react";

// BetterAuth must talk to THIS app's own origin so every auth call
// (sign-in, sign-out, get-session, OAuth state) rides the first-party
// `/api/:path*` rewrite in `next.config.ts`. Hitting the backend domain
// directly would be a cross-site request (the two *.vercel.app domains are
// separate sites under the Public Suffix List), so the browser would block
// the session and OAuth state cookies and the UI would stay logged out.
//
// Notes:
// - BetterAuth rejects a relative `baseURL` ("Invalid base URL"), so in the
//   browser we pass an absolute same-origin URL instead. Passing it
//   explicitly also wins over any NEXT_PUBLIC_BETTER_AUTH_URL env var, which
//   would otherwise point back at the backend.
// - During SSR there is no origin to read and no session fetch ever runs
//   (BetterAuth only fetches on mount in the browser), so we let it use its
//   own default config there.
export const authClient = createAuthClient(
  typeof window !== "undefined"
    ? { baseURL: `${window.location.origin}/api/auth` }
    : {},
);

export const { signIn, signUp, useSession, signOut, updateUser } = authClient;
