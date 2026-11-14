"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updateUser, useSession } from "@/lib/auth-client";
import { getInitials } from "@/lib/utils";

// Format the account creation date, tolerating both Date objects and ISO strings
function formatMemberSince(value: unknown): string {
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProfilePage() {
  const { data, isPending } = useSession();
  const user = data?.user;

  // Display name edit state
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Keep the local input in sync with the session user
  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setError("Display name must be at least 2 characters.");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const { error: updateError } = await updateUser({ name: trimmedName });

      if (updateError) {
        setError(updateError.message || "Could not update your display name.");
        return;
      }

      setName(trimmedName);
      setSuccess("Your display name has been updated.");
      setIsEditing(false);
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  // Loading state
  if (isPending) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background px-4 py-12">
        <div className="container mx-auto max-w-3xl space-y-6">
          <div className="h-9 w-56 animate-pulse rounded-md bg-muted" />
          <Card>
            <CardHeader>
              <div className="h-6 w-40 animate-pulse rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-32 animate-pulse rounded-md bg-muted" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-6 w-40 animate-pulse rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-20 animate-pulse rounded-md bg-muted" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Signed-out state
  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Sign in to view your profile
          </h1>
          <p className="text-muted-foreground max-w-md">
            You need to be signed in to manage your SpaceCraft account details.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Create Account</Button>
          </Link>
        </div>
      </div>
    );
  }

  const memberSince = formatMemberSince(user.createdAt);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background px-4 py-12">
      <div className="container mx-auto max-w-3xl space-y-6">
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your SpaceCraft account details.
          </p>
        </div>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xl">
              Account Details
            </CardTitle>
            <CardDescription>
              Your personal information as registered with SpaceCraft.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
              {/* Avatar placeholder */}
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-24 w-24 border border-border">
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback className="bg-indigo-100 text-2xl font-heading font-bold text-indigo-700">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">Avatar</span>
              </div>

              {/* Details */}
              <dl className="grid flex-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Name
                  </dt>
                  <dd className="truncate text-base font-semibold">
                    {name || user.name}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Email
                  </dt>
                  <dd className="truncate text-base font-semibold">
                    {user.email}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Member Since
                  </dt>
                  <dd className="text-base font-semibold">{memberSince}</dd>
                </div>
              </dl>
            </div>
          </CardContent>
        </Card>

        {/* Display Name Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xl">Display Name</CardTitle>
            <CardDescription>
              Update how your name appears across SpaceCraft.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="display-name" className="text-sm font-medium">
                    Display Name
                  </label>
                  <Input
                    id="display-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="John Doe"
                    autoFocus
                    disabled={isSaving}
                    maxLength={50}
                  />
                </div>

                {error && (
                  <div className="border-destructive/20 bg-destructive/10 rounded-md border p-3 text-sm font-medium text-destructive">
                    {error}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSaving}
                    onClick={() => {
                      setName(user.name);
                      setIsEditing(false);
                      setError("");
                      setSuccess("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">
                    Current display name
                  </p>
                  <p className="truncate text-lg font-semibold">
                    {name || user.name}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(true);
                    setSuccess("");
                    setError("");
                  }}
                >
                  Edit Name
                </Button>
              </div>
            )}

            {success && !isEditing && (
              <p className="mt-4 text-sm font-medium text-green-600">
                {success}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
