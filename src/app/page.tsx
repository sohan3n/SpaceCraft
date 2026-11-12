import { BrowseCategories } from "@/components/BrowseCategories";
import { FeaturedStudios } from "@/components/FeaturedStudios";
import { Hero } from "@/components/Hero";
import { HostGuarantee } from "@/components/HostGuarantee";
import { HowItWorks } from "@/components/HowItWorks";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <BrowseCategories />
      <FeaturedStudios />
      <HowItWorks />
      <HostGuarantee />
    </div>
  );
}