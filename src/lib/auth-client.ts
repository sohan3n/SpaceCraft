import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:5000", // The URL of your Express backend
});

export const { signIn, signUp, useSession, signOut, updateUser } = authClient;
