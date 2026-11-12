import Link from "next/link";
import { 
  Camera, 
  Video, 
  Mic, 
  Music, 
  Palette,
  ArrowRight
} from "lucide-react";

const CATEGORIES = [
  {
    title: "Photo Studios",
    description: "Cycloramas & daylight spaces",
    icon: Camera,
    href: "/studios?category=photo-studios",
  },
  {
    title: "Sound Stages",
    description: "Acoustically treated sets",
    icon: Video,
    href: "/studios?category=sound-stages",
  },
  {
    title: "Podcast Rooms",
    description: "Broadcast-ready audio suites",
    icon: Mic,
    href: "/studios?category=podcast-rooms",
  },
  {
    title: "Music Suites",
    description: "Recording & mixing booths",
    icon: Music,
    href: "/studios?category=music-suites",
  },
  {
    title: "Art Workshops",
    description: "Mess-friendly creative lofts",
    icon: Palette,
    href: "/studios?category=art-workshops",
  },
];

export function BrowseCategories() {
  return (
    <section className="w-full bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-2">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Browse by Category
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Find the perfect environment tailored to your production needs.
            </p>
          </div>
          <Link 
            href="/studios" 
            className="group flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            View all spaces
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.title}
                href={category.href}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:border-indigo-600/50 hover:shadow-md hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {category.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}