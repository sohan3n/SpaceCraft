"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import { Button } from "@/components/ui/button";

const HERO_SLIDES = [
  {
    id: 1,
    badge: "Photo Studios",
    headline: "Shoot in Light-Perfected Creative Spaces",
    subtext:
      "Book cyclorama walls, daylight lofts, and fully rigged photography studios by the hour—ready when your vision strikes.",
    image: "https://images.unsplash.com/photo-1664817550969-5e76adc4a3fe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3DE",
    categoryHref: "/studios?category=photo-studios",
  },
  {
    id: 2,
    badge: "Sound Stages",
    headline: "Cinema-Grade Sound Stages Built for Production",
    subtext:
      "From commercial sets to music videos, reserve acoustically treated stages equipped with professional rigging and power.",
    image: "https://images.unsplash.com/photo-1583482183620-f692113aafc3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    categoryHref: "/studios?category=sound-stages",
  },
  {
    id: 3,
    badge: "Podcast Rooms",
    headline: "Broadcast-Ready Podcast & Audio Suites",
    subtext:
      "Step into turnkey podcast rooms with multi-mic setups, acoustic isolation, and 4K multi-cam lighting ready to record.",
    image: "https://images.unsplash.com/photo-1668536618600-754ef972b9b3?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    categoryHref: "/studios?category=podcast-rooms",
  },
];

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-zinc-950">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        className="h-[540px] md:h-[620px] w-full [&_.swiper-button-next]:text-white [&_.swiper-button-prev]:text-white [&_.swiper-button-next]:after:text-xl [&_.swiper-button-prev]:after:text-xl [&_.swiper-button-next]:hidden md:[&_.swiper-button-next]:flex [&_.swiper-button-prev]:hidden md:[&_.swiper-button-prev]:flex [&_.swiper-pagination-bullet]:bg-white/50 [&_.swiper-pagination-bullet-active]:bg-indigo-500 [&_.swiper-pagination-bullet-active]:w-6 [&_.swiper-pagination-bullet]:transition-all"
      >
        {HERO_SLIDES.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full flex items-center">
              {/* Background Studio Image */}
              <Image
                src={slide.image}
                alt={slide.badge}
                fill
                priority={index === 0}
                className="object-cover object-center"
              />

              {/* Dark Gradient Overlay for High-Contrast Readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/70 to-zinc-950/30" />

              {/* Slide Content */}
              <div className="container relative z-10 mx-auto px-4 md:px-8">
                <div className="max-w-2xl space-y-6">
                  {/* Category Pill */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/15 px-3.5 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-sm">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{slide.badge}</span>
                  </div>

                  {/* Punchy Headline */}
                  <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                    {slide.headline}
                  </h1>

                  {/* Subtext */}
                  <p className="text-base sm:text-lg text-zinc-300 max-w-xl leading-relaxed">
                    {slide.subtext}
                  </p>

                  {/* Primary & Secondary CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                    <Link href="/studios">
                      <Button
                        size="lg"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium h-12 px-7 text-base"
                      >
                        Explore Studios
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>

                    <Link href="/add-studio">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm font-medium h-12 px-7 text-base"
                      >
                        Host Your Space
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}