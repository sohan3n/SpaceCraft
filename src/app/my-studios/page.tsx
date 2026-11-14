"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import {
  Building2,
  Calendar,
  Check,
  Clock,
  Compass,
  ExternalLink,
  Inbox,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";

interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioLocation: string;
  renterId: string;
  renterName: string;
  renterEmail: string;
  hostId: string;
  hostName: string;
  date: string;
  startTime: string;
  hours: number;
  hourlyRate: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt?: string;
}

type DashboardTab = "studios" | "requests" | "bookings";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80";

function SafeThumbnail({ src, alt }: { src?: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      unoptimized
      className="object-cover"
      onError={() => setImgSrc(FALLBACK_IMAGE)}
    />
  );
}

function StatusBadge({ status }: { status: Booking["status"] }) {
  const styles: Record<Booking["status"], string> = {
    pending:
      "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    confirmed:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    cancelled:
      "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function MyStudiosDashboardPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = useSession();

  const [activeTab, setActiveTab] = useState<DashboardTab>("studios");
  const [hostStudios, setHostStudios] = useState<Studio[]>([]);
  const [hostBookings, setHostBookings] = useState<Booking[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [feedbackError, setFeedbackError] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);

  // Client-side session safety net
  useEffect(() => {
    if (!isSessionPending && !session) {
      router.replace("/login");
    }
  }, [isSessionPending, session, router]);

  // Fetch host studios, incoming host requests, and renter bookings in parallel
  useEffect(() => {
    if (!session) return;

    async function loadDashboardData() {
      setIsLoading(true);
      try {
        const [studiosRes, hostBookingsRes, myBookingsRes] = await Promise.all([
          fetch("http://localhost:5000/api/studios/host/me", {
            credentials: "include",
          }),
          fetch("http://localhost:5000/api/bookings/host", {
            credentials: "include",
          }),
          fetch("http://localhost:5000/api/bookings/me", {
            credentials: "include",
          }),
        ]);

        const [studiosData, hostBookingsData, myBookingsData] = await Promise.all([
          studiosRes.json(),
          hostBookingsRes.json(),
          myBookingsRes.json(),
        ]);

        const loadedStudios: Studio[] =
          studiosData.success && Array.isArray(studiosData.studios)
            ? studiosData.studios
            : [];
        const loadedHostBookings: Booking[] =
          hostBookingsData.success && Array.isArray(hostBookingsData.bookings)
            ? hostBookingsData.bookings
            : [];
        const loadedMyBookings: Booking[] =
          myBookingsData.success && Array.isArray(myBookingsData.bookings)
            ? myBookingsData.bookings
            : [];

        setHostStudios(loadedStudios);
        setHostBookings(loadedHostBookings);
        setMyBookings(loadedMyBookings);

        // If user is a pure renter with no listed studios yet, default to My Bookings
        if (loadedStudios.length === 0 && loadedMyBookings.length > 0) {
          setActiveTab("bookings");
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setFeedbackError("Could not load your dashboard data. Please refresh.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [session]);

  async function handleDeleteStudio(studioId: string) {
    setFeedbackError("");
    setFeedbackSuccess("");
    setDeletingId(studioId);

    try {
      const res = await fetch(`http://localhost:5000/api/studios/${studioId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setFeedbackError(data.message || "Failed to delete studio.");
        setDeletingId(null);
        return;
      }

      setHostStudios((prev) => prev.filter((item) => item._id !== studioId));
      setConfirmDeleteId(null);
      setFeedbackSuccess("Studio listing deleted successfully.");
    } catch {
      setFeedbackError("Network error while deleting studio.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleBookingStatus(
    bookingId: string,
    status: "confirmed" | "cancelled",
    listType: "host" | "renter"
  ) {
    setFeedbackError("");
    setFeedbackSuccess("");
    setUpdatingBookingId(bookingId);

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setFeedbackError(data.message || "Could not update booking status.");
        setUpdatingBookingId(null);
        return;
      }

      if (listType === "host") {
        setHostBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
        );
      } else {
        setMyBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
        );
      }

      setFeedbackSuccess(`Booking marked as ${status}.`);
    } catch {
      setFeedbackError("Network error while updating booking status.");
    } finally {
      setUpdatingBookingId(null);
    }
  }

  if (isSessionPending) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const pendingRequestsCount = hostBookings.filter(
    (b) => b.status === "pending"
  ).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Top Header */}
        <div className="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              My Studios & Bookings
            </h1>
            <p className="mt-1.5 text-muted-foreground">
              Manage your listed creative spaces, incoming host requests, and upcoming sessions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/studios">
              <Button variant="outline" className="gap-2">
                <Compass className="h-4 w-4" />
                Browse Catalog
              </Button>
            </Link>
            <Link href="/add-studio">
              <Button className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700">
                <Plus className="h-4 w-4" />
                List New Studio
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider">
                Listed Studios
              </CardDescription>
              <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="font-heading text-3xl font-bold">
                {isLoading ? "—" : hostStudios.length}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Active spaces you host
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider">
                Pending Host Requests
              </CardDescription>
              <Inbox className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="font-heading text-3xl font-bold">
                {isLoading ? "—" : pendingRequestsCount}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Awaiting your approval
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider">
                My Bookings
              </CardDescription>
              <Calendar className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="font-heading text-3xl font-bold">
                {isLoading ? "—" : myBookings.length}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Sessions booked by you
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Banners */}
        {feedbackError && (
          <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            <span>{feedbackError}</span>
            <button
              type="button"
              onClick={() => setFeedbackError("")}
              className="ml-4 hover:opacity-75"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {feedbackSuccess && (
          <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <span>{feedbackSuccess}</span>
            <button
              type="button"
              onClick={() => setFeedbackSuccess("")}
              className="ml-4 hover:opacity-75"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Three-Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("studios")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "studios"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Building2 className="h-4 w-4" />
            My Listed Studios
            <span className="rounded-full bg-black/15 px-2 py-0.5 text-xs">
              {hostStudios.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("requests")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "requests"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Inbox className="h-4 w-4" />
            Incoming Requests
            <span className="rounded-full bg-black/15 px-2 py-0.5 text-xs">
              {hostBookings.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "bookings"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Calendar className="h-4 w-4" />
            My Bookings
            <span className="rounded-full bg-black/15 px-2 py-0.5 text-xs">
              {myBookings.length}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-32 w-full animate-pulse rounded-2xl border bg-muted/50"
              />
            ))}
          </div>
        ) : activeTab === "studios" ? (
          /* TAB 1: MY LISTED STUDIOS */
          hostStudios.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-14 text-center">
              <Building2 className="mb-3 h-10 w-10 text-muted-foreground" />
              <h2 className="font-heading text-xl font-semibold">
                You haven&apos;t listed any studios yet
              </h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Turn your photography, podcast, or music workspace into a bookable studio on SpaceCraft.
              </p>
              <Link href="/add-studio" className="mt-5">
                <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                  List Your First Studio
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {hostStudios.map((studio) => {
                const isConfirming = confirmDeleteId === studio._id;
                const isDeleting = deletingId === studio._id;

                return (
                  <div
                    key={studio._id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-40">
                        <SafeThumbnail
                          src={studio.images?.[0]}
                          alt={studio.title}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                            {studio.category}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            {studio.location}
                          </span>
                        </div>

                        <h3 className="font-heading text-lg font-bold">
                          {studio.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            ${studio.hourlyRate} / hr
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            Up to {studio.capacity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Studio Actions */}
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <Link href={`/studios/${studio._id}`}>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <ExternalLink className="h-3.5 w-3.5" />
                          View Page
                        </Button>
                      </Link>

                      {isConfirming ? (
                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={() => handleDeleteStudio(studio._id)}
                          >
                            {isDeleting ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              "Confirm Delete"
                            )}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={isDeleting}
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setConfirmDeleteId(studio._id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : activeTab === "requests" ? (
          /* TAB 2: INCOMING HOST REQUESTS */
          hostBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-14 text-center">
              <Inbox className="mb-3 h-10 w-10 text-muted-foreground" />
              <h2 className="font-heading text-xl font-semibold">
                No incoming booking requests yet
              </h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                When creators request to book one of your spaces, their session details will appear here for approval.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {hostBookings.map((booking) => {
                const isUpdating = updatingBookingId === booking._id;

                return (
                  <div
                    key={booking._id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <StatusBadge status={booking.status} />
                        <Link
                          href={`/studios/${booking.studioId}`}
                          className="font-heading text-lg font-bold hover:text-indigo-500"
                        >
                          {booking.studioTitle}
                        </Link>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Requested by{" "}
                        <span className="font-semibold text-foreground">
                          {booking.renterName}
                        </span>{" "}
                        ({booking.renterEmail})
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                          {booking.date}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-indigo-500" />
                          {booking.startTime} ({booking.hours}{" "}
                          {booking.hours === 1 ? "hr" : "hrs"})
                        </span>
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                          Total: ${booking.totalPrice}
                        </span>
                      </div>
                    </div>

                    {booking.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          disabled={isUpdating}
                          onClick={() =>
                            handleBookingStatus(booking._id, "confirmed", "host")
                          }
                          className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          {isUpdating ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          Approve
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={isUpdating}
                          onClick={() =>
                            handleBookingStatus(booking._id, "cancelled", "host")
                          }
                          className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="h-3.5 w-3.5" />
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        ) : /* TAB 3: MY BOOKINGS (AS RENTER) */
        myBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-14 text-center">
            <Calendar className="mb-3 h-10 w-10 text-muted-foreground" />
            <h2 className="font-heading text-xl font-semibold">
              No studio bookings yet
            </h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Explore creative studios and reserve your next shoot or recording session.
            </p>
            <Link href="/studios" className="mt-5">
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                Explore Studios
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myBookings.map((booking) => {
              const isUpdating = updatingBookingId === booking._id;

              return (
                <div
                  key={booking._id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-40">
                      <SafeThumbnail
                        src={booking.studioImage}
                        alt={booking.studioTitle}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <StatusBadge status={booking.status} />
                        <span className="text-xs text-muted-foreground">
                          Hosted by {booking.hostName}
                        </span>
                      </div>

                      <Link
                        href={`/studios/${booking.studioId}`}
                        className="block font-heading text-lg font-bold hover:text-indigo-500"
                      >
                        {booking.studioTitle}
                      </Link>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {booking.studioLocation}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                          {booking.date}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-indigo-500" />
                          {booking.startTime} ({booking.hours}{" "}
                          {booking.hours === 1 ? "hr" : "hrs"})
                        </span>
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                          ${booking.totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:justify-end">
                    <Link href={`/studios/${booking.studioId}`}>
                      <Button variant="outline" size="sm">
                        View Studio
                      </Button>
                    </Link>

                    {booking.status !== "cancelled" && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={isUpdating}
                        onClick={() =>
                          handleBookingStatus(booking._id, "cancelled", "renter")
                        }
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        {isUpdating ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          "Cancel Booking"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}