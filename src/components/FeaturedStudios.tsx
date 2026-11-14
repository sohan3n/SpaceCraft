"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudioCard, type Studio } from "@/components/StudioCard";

export function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedStudios() {
      try {
        const res = await fetch("http://localhost:5000/api/studios?limit=6");
        const data = await res.json();
        if (data.success && Array.isArray(data.studios)) {
          setStudios(data.studios);
        }
      } catch (error) {
        console.error("Failed to load featured studios:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFeaturedStudios();
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Featured Studios
            </h2>
            <p className="mt-2 text-muted-foreground">
              Handpicked creative spaces ready for your next shoot, session, or recording.
            </p>
          </div>
          <Link href="/studios">
            <Button variant="outline" className="gap-2">
              View All Studios
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
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
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="font-heading text-lg font-semibold">No studios listed yet</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Be the first host to list a creative workspace on SpaceCraft.
            </p>
            <Link href="/add-studio" className="mt-5">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                List Your Space
              </Button>
            </Link>
          </div>
        ) : (
          /* Live Studio Cards Grid */
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
    </section>
  );
}