"use client";

import {
  CalendarDays,
  LayoutDashboard,
  ListVideo,
  LogOut,
  Menu,
  PlusSquare,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/#about-us" },
];

export function Navbar() {
  const pathname = usePathname();

  // MOCK AUTH STATE
  const isAuthenticated = false;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between">
        {/* LEFT: Dual Logo Setup */}
        <Link href="/" className="flex items-center gap-2">
          {/* Adjusted to a wide rectangle (h-10 w-52) to fit the new text-integrated logo perfectly */}
          <div className="relative h-10 w-52">
            {/* LIGHT THEME LOGO: Hidden in dark mode */}
            <Image
              src="/logo-light.png"
              alt="SpaceCraft Logo"
              fill
              className="object-contain dark:hidden"
              priority
            />
            {/* DARK THEME LOGO: Hidden in light mode */}
            <Image
              src="/logo-dark.png"
              alt="SpaceCraft Logo"
              fill
              className="object-contain hidden dark:block"
              priority
            />
          </div>
        </Link>

        {/* MIDDLE: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                  isActive
                    ? "text-indigo-600 border-b-2 border-indigo-600 py-1"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: Actions & Auth */}
        <div className="flex items-center gap-4">
          <ModeToggle />

          {/* Desktop Auth States */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                {/* FIXED: Removed asChild and <Button> to prevent <button> inside <button> hydration crashes */}
                <DropdownMenuTrigger className="relative h-10 w-10 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
                  <Avatar className="h-10 w-10 border border-border hover:opacity-80 transition-opacity">
                    <AvatarImage src="" alt="@user" />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 font-heading font-bold">
                      US
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem
                    render={
                      <Link
                        href="/dashboard"
                        className="cursor-pointer font-medium"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                      </Link>
                    }
                  />
                  <DropdownMenuItem
                    render={
                      <Link
                        href="/add-studio"
                        className="cursor-pointer font-medium"
                      >
                        <PlusSquare className="mr-2 h-4 w-4" /> Add New Studio
                      </Link>
                    }
                  />
                  <DropdownMenuItem
                    render={
                      <Link
                        href="/my-listings"
                        className="cursor-pointer font-medium"
                      >
                        <ListVideo className="mr-2 h-4 w-4" /> My Studio
                        Listings
                      </Link>
                    }
                  />
                  <DropdownMenuItem
                    render={
                      <Link
                        href="/my-bookings"
                        className="cursor-pointer font-medium"
                      >
                        <CalendarDays className="mr-2 h-4 w-4" /> My Bookings
                      </Link>
                    }
                  />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 cursor-pointer font-medium">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="font-medium hover:text-indigo-600"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                >
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet>
            {/* FIXED: Removed asChild and <Button> to prevent <button> nesting crashes */}
            <SheetTrigger className="md:hidden p-2 rounded-md hover:bg-accent text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
              <nav className="flex flex-col gap-4 mt-8">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium font-heading hover:text-indigo-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-4 border-t pt-6">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center text-lg font-medium"
                    >
                      <LayoutDashboard className="mr-2 h-5 w-5 text-indigo-600" />{" "}
                      Dashboard
                    </Link>
                    <Link
                      href="/add-studio"
                      className="flex items-center text-lg font-medium"
                    >
                      <PlusSquare className="mr-2 h-5 w-5 text-indigo-600" />{" "}
                      Add New Studio
                    </Link>
                    <Link
                      href="/my-listings"
                      className="flex items-center text-lg font-medium"
                    >
                      <ListVideo className="mr-2 h-5 w-5 text-indigo-600" /> My
                      Listings
                    </Link>
                    <Link
                      href="/my-bookings"
                      className="flex items-center text-lg font-medium"
                    >
                      <CalendarDays className="mr-2 h-5 w-5 text-indigo-600" />{" "}
                      My Bookings
                    </Link>
                    <Button variant="destructive" className="w-full mt-4">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Link href="/register">Register</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
