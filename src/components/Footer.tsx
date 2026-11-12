"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const QUICK_LINKS = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "About Us", href: "/#about-us" },
  { name: "Contact", href: "/#contact" },
];

const CATEGORY_LINKS = [
  { name: "Photo Studios", href: "/studios?category=photo-studios" },
  { name: "Sound Stages", href: "/studios?category=sound-stages" },
  { name: "Podcast Rooms", href: "/studios?category=podcast-rooms" },
];

export function Footer() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="w-full border-t bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* COLUMN 1: Dual Logo & Mission Statement */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-block w-fit">
              <div className="relative h-10 w-52">
                <Image
                  src="/logo-light.png"
                  alt="SpaceCraft Logo"
                  fill
                  className="object-contain object-left dark:hidden"
                />
                <Image
                  src="/logo-dark.png"
                  alt="SpaceCraft Logo"
                  fill
                  className="object-contain object-left hidden dark:block"
                />
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Empowering creators with professional studio spaces tailored for
              every vision.
            </p>
          </div>

          {/* COLUMN 2: Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading font-semibold text-base tracking-tight">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Popular Studio Categories */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading font-semibold text-base tracking-tight">
              Categories
            </h3>
            <ul className="flex flex-col gap-2.5">
              {CATEGORY_LINKS.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: Newsletter */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading font-semibold text-base tracking-tight">
              Newsletter
            </h3>
            <p className="text-sm text-muted-foreground">
              Get updates on new studio spaces and exclusive creator rates.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 rounded-md border border-indigo-600/30 bg-indigo-600/10 px-3 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Subscribed to SpaceCraft updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
                <Input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                />
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                >
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* BOTTOM BAR: Copyright, Terms & Social Links */}
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-muted-foreground">
            <span>&copy; 2026 SpaceCraft. All rights reserved.</span>
            <span>|</span>
            <Link href="/terms" className="hover:text-indigo-600 transition-colors">
              Terms
            </Link>
            <span>&amp;</span>
            <Link href="/privacy" className="hover:text-indigo-600 transition-colors">
              Privacy
            </Link>
          </div>

          {/* Social Links (with updated X logo) */}
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-indigo-600 transition-colors"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
              </svg>
            </Link>

            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-indigo-600 transition-colors"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
              </svg>
            </Link>

            <Link
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="hover:text-indigo-600 transition-colors"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>

            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="hover:text-indigo-600 transition-colors"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}