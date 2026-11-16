"use client";

import { Building2, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { type Studio, StudioCard } from "@/components/StudioCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/api";

const CATEGORIES = [
  "All",
  "Photography",
  "Podcast",
  "Music",
  "Film",
  "Dance",
  "Art",
];

function normalizeCategory(raw: string | null): string {
  if (!raw) return "All";
  const matched = CATEGORIES.find(
    (cat) => cat.toLowerCase() === raw.trim().toLowerCase(),
  );
  return matched || "All";
}

function StudiosCatalogContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // The URL query is the SINGLE SOURCE OF TRUTH for the active category.
  // Deriving it (instead of mirroring it into useState) guarantees the pill,
  // the "Showing N studios in X" label and the fetched data can never drift
  // apart, and makes a plain href="/studios" reset everything to "All".
  const activeCategory = normalizeCategory(searchParams.get("category"));

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch filtered studios from Express backend.
  // AbortController guarantees only the LATEST request may write state: when the
  // category/search changes (or the component unmounts) the in-flight request is
  // aborted, so a slow earlier response can never overwrite a newer one.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchStudios() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory !== "All") {
          params.set("category", activeCategory);
        }
        if (debouncedSearch.trim()) {
          params.set("search", debouncedSearch.trim());
        }

        const queryString = params.toString();
        const url = `${API_BASE_URL}/api/studios${
          queryString ? `?${queryString}` : ""
        }`;

        // cache: "no-store" -> never reuse a cached response across switches.
        const res = await fetch(url, {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await res.json();

        // A newer request (or unmount) took over while we were awaiting.
        if (controller.signal.aborted) return;

        if (data.success && Array.isArray(data.studios)) {
          setStudios(data.studios);
        } else {
          setStudios([]);
        }
      } catch (error) {
        // Ignore intentional aborts — a newer request owns the state now.
        if (
          controller.signal.aborted ||
          (error instanceof DOMException && error.name === "AbortError")
        ) {
          return;
        }
        console.error("Failed to fetch studios:", error);
        setStudios([]);
      } finally {
        // Don't clear the spinner for an aborted run: the follow-up run has
        // already set isLoading back to true and owns it now.
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchStudios();

    return () => controller.abort();
  }, [activeCategory, debouncedSearch]);

  // Pills only touch the URL — the derived activeCategory above does the rest.
  function handleSelectCategory(category: string) {
    const nextUrl =
      category === "All"
        ? pathname
        : `${pathname}?category=${encodeURIComponent(category)}`;
    router.replace(nextUrl, { scroll: false });
  }

  function clearFilters() {
    setSearchQuery("");
    setDebouncedSearch("");
    router.replace(pathname, { scroll: false });
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Explore Creative Studios
            </h1>
            <p className="mt-2 text-muted-foreground">
              Browse verified photography stages, recording booths, and
              production spaces.
            </p>
          </div>
          <Link href="/add-studio">
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="h-4 w-4" />
              List Your Space
            </Button>
          </Link>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="space-y-4">
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by studio name, city, or equipment..."
              className="h-10 pl-10 pr-10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Category:
            </span>
            {CATEGORIES.map((category) => {
              const active =
                activeCategory.toLowerCase() === category.toLowerCase();
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleSelectCategory(category)}
                  className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        {!isLoading && (
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {studios.length}
            </span>{" "}
            {studios.length === 1 ? "studio" : "studios"}
            {activeCategory !== "All" && (
              <>
                {" "}
                in{" "}
                <span className="font-semibold text-indigo-500">
                  {activeCategory}
                </span>
              </>
            )}
          </div>
        )}

        {/* Studios Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border bg-card shadow-sm"
              >
                <div className="aspect-[4/3] w-full animate-pulse bg-muted" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                  <div className="pt-4 border-t border-border/50 flex justify-between">
                    <div className="h-6 w-16 animate-pulse rounded bg-muted" />
                    <div className="h-8 w-24 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : studios.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-14 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground mb-3" />
            <h2 className="font-heading text-xl font-semibold">
              No matching studios found
            </h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Try adjusting your search keywords or switching back to all
              categories.
            </p>
            <Button variant="outline" onClick={clearFilters} className="mt-5">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard
                key={studio._id}
                id={studio._id}
                title={studio.title}
                category={studio.category}
                price={studio.hourlyRate}
                location={studio.location}
                image={studio.images?.[0] || ""}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudiosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] bg-background py-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="h-10 w-64 animate-pulse rounded bg-muted" />
          </div>
        </div>
      }
    >
      <StudiosCatalogContent />
    </Suspense>
  );
}
