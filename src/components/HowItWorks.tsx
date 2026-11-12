import { Search, Clock, CalendarCheck, Clapperboard } from "lucide-react";

const STEPS = [
  {
    title: "1. Discover Spaces",
    description: "Browse hundreds of verified studios tailored to your specific creative needs.",
    icon: Search,
  },
  {
    title: "2. Select Shoot Hours",
    description: "Pick your exact dates and hourly slots with real-time availability.",
    icon: Clock,
  },
  {
    title: "3. Book Instantly",
    description: "Secure your space immediately with transparent, upfront pricing.",
    icon: CalendarCheck,
  },
  {
    title: "4. Create & Produce",
    description: "Show up, set up, and bring your creative vision to life seamlessly.",
    icon: Clapperboard,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-background py-16 md:py-24 scroll-mt-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12 text-center max-w-2xl mx-auto space-y-4">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            How SpaceCraft Works
          </h2>
          <p className="text-lg text-muted-foreground">
            From scouting to shooting in four simple steps. We handle the logistics so you can focus on the creative.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Decorative connecting line for desktop */}
          <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-border z-0" />
          
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background border-2 border-indigo-100 dark:border-indigo-900 shadow-sm text-indigo-600 dark:text-indigo-400">
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}