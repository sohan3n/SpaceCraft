import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StudioCard } from "@/components/StudioCard";

const MOCK_STUDIOS = [
  {
    id: "1",
    title: "Apex Daylight Cyc Wall",
    category: "Photo Studios",
    price: 85,
    rating: 4.9,
    location: "Downtown Arts District",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Echo Sound Stage A",
    category: "Sound Stages",
    price: 150,
    rating: 5.0,
    location: "Westside Production Hub",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "The Vocal Booth Pro",
    category: "Podcast Rooms",
    price: 45,
    rating: 4.8,
    location: "Midtown Media Center",
    image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Neon Glow Creative Room",
    category: "Art Workshops",
    price: 60,
    rating: 4.7,
    location: "East End Lofts",
    image: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "5",
    title: "Symphony Mixing Suite",
    category: "Music Suites",
    price: 95,
    rating: 4.9,
    location: "Uptown Records Building",
    image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "6",
    title: "Lumina Lifestyle Setup",
    category: "Photo Studios",
    price: 75,
    rating: 4.6,
    location: "Downtown Arts District",
    image: "https://images.unsplash.com/photo-1611093791822-15086535830b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
];

export function FeaturedStudios() {
  return (
    <section className="w-full bg-zinc-50 dark:bg-zinc-900/20 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-2">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Featured Spaces
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Explore top-rated studios handpicked for your next creative project.
            </p>
          </div>
          <Link 
            href="/studios" 
            className="group flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            Browse all studios
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 6-Card Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_STUDIOS.map((studio) => (
            <StudioCard key={studio.id} {...studio} />
          ))}
        </div>

      </div>
    </section>
  );
}