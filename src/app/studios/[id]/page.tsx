"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import type { Studio } from "@/components/StudioCard";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80";

const START_TIME_SLOTS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function StudioDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = useSession();

  const studioId = params?.id;

  const [studio, setStudio] = useState<Studio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(FALLBACK_IMAGE);

  // Booking calculator state
  const minDate = getTodayDateString();
  const [bookingDate, setBookingDate] = useState<string>(minDate);
  const [startTime, setStartTime] = useState<string>("10:00 AM");
  const [hours, setHours] = useState<number>(2);
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string>("");
  const [bookingSuccess, setBookingSuccess] = useState<string>("");

  useEffect(() => {
    if (!studioId) return;

    async function fetchStudioDetails() {
      setIsLoading(true);
      setNotFoundError(false);

      try {
        const res = await fetch(`http://localhost:5000/api/studios/${studioId}`);
        const data = await res.json();

        if (!res.ok || !data.success || !data.studio) {
          setNotFoundError(true);
          setStudio(null);
        } else {
          setStudio(data.studio);
          setImageSrc(data.studio.images?.[0] || FALLBACK_IMAGE);
        }
      } catch (error) {
        console.error("Failed to fetch studio details:", error);
        setNotFoundError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStudioDetails();
  }, [studioId]);

  async function handleReserveSpace(e: React.FormEvent) {
    e.preventDefault();
    if (!studio || !session) return;

    setBookingError("");
    setBookingSuccess("");
    setIsBooking(true);

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          studioId: studio._id,
          date: bookingDate,
          startTime,
          hours,
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        setBookingError(
          "Booking API is not active yet. We will enable live reservations in the next step."
        );
        setIsBooking(false);
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        setBookingError(data.message || "Could not complete your reservation.");
        setIsBooking(false);
        return;
      }

      setBookingSuccess("Reservation request submitted! Redirecting to your dashboard...");
      setTimeout(() => {
        router.push("/my-studios");
      }, 1200);
    } catch {
      setBookingError("Network error: Unable to connect to the booking server.");
      setIsBooking(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="h-8 w-36 animate-pulse rounded bg-muted" />
          <div className="h-10 w-2/3 animate-pulse rounded bg-muted" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="aspect-[16/9] w-full animate-pulse rounded-2xl bg-muted" />
              <div className="h-40 w-full animate-pulse rounded-2xl bg-muted" />
            </div>
            <div className="h-96 w-full animate-pulse rounded-2xl bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (notFoundError || !studio) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md border-border/60 text-center shadow-lg">
          <CardHeader className="space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Building2 className="h-6 w-6" />
            </div>
            <CardTitle className="font-heading text-2xl font-bold">
              Studio Not Found
            </CardTitle>
            <CardDescription>
              This space may have been removed by its host or the link is invalid.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/studios">
              <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
                Browse Available Studios
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPrice = studio.hourlyRate * hours;
  const isOwner = Boolean(session?.user?.id && session.user.id === studio.hostId);
  const hostInitial = (studio.hostName || "H").charAt(0).toUpperCase();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Top Back Navigation */}
        <div>
          <Link href="/studios">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Studios
            </Button>
          </Link>
        </div>

        {/* Title & Metadata Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              {studio.category}
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-medium">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              4.9
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 text-indigo-500" />
              {studio.location}
            </span>
          </div>

          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {studio.title}
          </h1>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
          {/* Left Column: Showcase, Host Info, Description & Amenities */}
          <div className="space-y-8 lg:col-span-2">
            {/* Cover Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border bg-muted shadow-sm">
              <Image
                src={imageSrc}
                alt={studio.title}
                fill
                unoptimized
                priority
                className="object-cover"
                onError={() => setImageSrc(FALLBACK_IMAGE)}
              />
            </div>

            {/* Host & Capacity Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 font-heading text-base font-bold text-white">
                  {hostInitial}
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Hosted by {studio.hostName || "SpaceCraft Host"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Verified Studio Partner
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-lg bg-muted/60 px-3.5 py-2 text-sm font-medium">
                <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Up to {studio.capacity} {studio.capacity === 1 ? "person" : "people"}
              </div>
            </div>

            {/* About This Space */}
            <div className="space-y-3 rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="font-heading text-xl font-bold">About This Space</h2>
              <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                {studio.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="font-heading text-xl font-bold">Included Amenities</h2>
              </div>

              {studio.amenities && studio.amenities.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {studio.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm font-medium"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Standard studio workspace access included.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Booking Calculator */}
          <div className="lg:sticky lg:top-24">
            <Card className="border-border/70 shadow-lg">
              <CardHeader className="border-b pb-5">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-heading text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      ${studio.hourlyRate}
                    </span>
                    <span className="ml-1 text-sm text-muted-foreground">/ hour</span>
                  </div>
                  <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Instant Request
                  </span>
                </div>
                <CardDescription>
                  Select your session date and duration to calculate total cost.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={handleReserveSpace} className="space-y-4">
                  {/* Date Picker */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="booking-date"
                      className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      Session Date
                    </label>
                    <Input
                      id="booking-date"
                      type="date"
                      min={minDate}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* Start Time & Duration */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="start-time"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        <Clock className="h-3.5 w-3.5" />
                        Start Time
                      </label>
                      <select
                        id="start-time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        {START_TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="duration-hours"
                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        Duration
                      </label>
                      <select
                        id="duration-hours"
                        value={hours}
                        onChange={(e) => setHours(Number(e.target.value))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((hr) => (
                          <option key={hr} value={hr}>
                            {hr} {hr === 1 ? "hour" : "hours"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 rounded-xl bg-muted/40 p-4 text-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>
                        ${studio.hourlyRate} × {hours} {hours === 1 ? "hour" : "hours"}
                      </span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Platform service fee</span>
                      <span className="text-emerald-600 dark:text-emerald-400">$0</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-border pt-2.5 text-base font-bold">
                      <span>Total</span>
                      <span className="text-indigo-600 dark:text-indigo-400">
                        ${totalPrice}
                      </span>
                    </div>
                  </div>

                  {bookingError && (
                    <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
                      {bookingError}
                    </div>
                  )}

                  {bookingSuccess && (
                    <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {bookingSuccess}
                    </div>
                  )}

                  {/* Role-Aware Action Button */}
                  {isSessionPending ? (
                    <Button disabled className="w-full">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking Session...
                    </Button>
                  ) : !session ? (
                    <Link href="/login" className="block">
                      <Button
                        type="button"
                        className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Sign in to Book
                      </Button>
                    </Link>
                  ) : isOwner ? (
                    <div className="space-y-2">
                      <Link href="/my-studios" className="block">
                        <Button type="button" variant="outline" className="w-full">
                          Manage Your Listing
                        </Button>
                      </Link>
                      <p className="text-center text-xs text-muted-foreground">
                        You are the host of this studio.
                      </p>
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isBooking}
                      className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      {isBooking ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting Request...
                        </>
                      ) : (
                        `Reserve Space • $${totalPrice}`
                      )}
                    </Button>
                  )}

                  <div className="flex items-center justify-center gap-1.5 pt-1 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-indigo-500" />
                    <span>Protected by SpaceCraft Booking Guarantee</span>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}