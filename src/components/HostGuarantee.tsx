import { ShieldCheck, UserCheck, Wrench, Headset } from "lucide-react";

const GUARANTEES = [
  {
    title: "Liability Protection",
    description: "Every booking includes up to $1M in property damage protection and liability coverage.",
    icon: ShieldCheck,
  },
  {
    title: "Verified Profiles",
    description: "All hosts and creators undergo rigorous ID checks to ensure a safe community.",
    icon: UserCheck,
  },
  {
    title: "Equipment Safety",
    description: "Pre-shoot checklists and secure access guarantee gear is exactly as listed.",
    icon: Wrench,
  },
  {
    title: "24/7 Host Support",
    description: "Our dedicated creator success team is on standby around the clock.",
    icon: Headset,
  },
];

export function HostGuarantee() {
  return (
    <section id="about-us" className="w-full bg-zinc-950 py-16 md:py-24 text-zinc-50 scroll-mt-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Copy */}
          <div className="space-y-6 max-w-xl">
            <div className="inline-flex items-center rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300">
              Host Guarantee & Creator Support
            </div>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
              Create with absolute confidence.
            </h2>
            <p className="text-lg text-zinc-400 leading-relaxed">
              We built SpaceCraft on a foundation of trust. Whether you are opening your doors to other creatives or booking a space for your biggest client, we protect your vision end-to-end.
            </p>
          </div>

          {/* Right Column: Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {GUARANTEES.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex flex-col space-y-3 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                  <Icon className="h-8 w-8 text-indigo-400" />
                  <h3 className="font-heading font-semibold text-zinc-100">{item.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
          
        </div>
      </div>
    </section>
  );
}