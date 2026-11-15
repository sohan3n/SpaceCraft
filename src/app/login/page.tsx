"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GoogleIcon } from "@/components/google-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn, useSession } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const FORGOT_NOTICE =
  "Automated password reset emails are disabled in this demo environment so examiners can test freely. Please sign in with your registered credentials or Continue with Google.";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [globalError, setGlobalError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  // Only safe, internal relative paths are honoured as post-login destinations
  const rawCallback = searchParams.get("callbackUrl");
  const redirectTo =
    rawCallback?.startsWith("/") && !rawCallback.startsWith("//")
      ? rawCallback
      : "/";

  // Surface any OAuth redirect error returned in ?error=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authError = params.get("error");
    if (authError === "unable_to_link_account") {
      setGlobalError(
        "Unable to link Google account. If you recently reset test users in MongoDB, clear the 'account' and 'session' collections and try again.",
      );
    } else if (authError) {
      setGlobalError(
        `Authentication error (${authError.replace(/_/g, " ")}). Please try again.`,
      );
    }
  }, []);

  // Client-side safety net: already-signed-in visitors leave /login
  const { data: session, isPending } = useSession();
  useEffect(() => {
    if (!isPending && session) {
      router.replace("/");
    }
  }, [isPending, session, router]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    setGlobalError("");

    try {
      const { error } = await signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setGlobalError(error.message || "Invalid email or password.");
        setIsLoading(false);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setGlobalError("A network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setGlobalError("");
    setIsGoogleLoading(true);

    try {
      const origin = window.location.origin;
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: `${origin}${redirectTo}`,
        errorCallbackURL: `${origin}/login`,
      });

      if (error) {
        setGlobalError(error.message || "Could not continue with Google.");
        setIsGoogleLoading(false);
        return;
      }
    } catch {
      setGlobalError("A network error occurred. Please try again.");
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="font-heading text-3xl font-bold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to your SpaceCraft account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <button
                        type="button"
                        onClick={() => setShowForgotNotice((prev) => !prev)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    {showForgotNotice && (
                      <div className="flex items-start justify-between gap-3 rounded-md border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
                        <span>{FORGOT_NOTICE}</span>
                        <button
                          type="button"
                          aria-label="Dismiss password reset notice"
                          onClick={() => setShowForgotNotice(false)}
                          className="shrink-0 font-semibold text-foreground hover:text-indigo-600"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {globalError && (
                <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                  {globalError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          {/* Social Sign-In Divider */}
          <div className="mt-6 space-y-4">
            <div className="relative flex items-center">
              <div className="flex-1 border-t border-border" />
              <span className="mx-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Or continue with
              </span>
              <div className="flex-1 border-t border-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting to Google...
                </>
              ) : (
                <>
                  <GoogleIcon className="mr-2 h-4 w-4" />
                  Continue with Google
                </>
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-6">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-background">
          <div className="h-10 w-64 animate-pulse rounded-md bg-muted" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
