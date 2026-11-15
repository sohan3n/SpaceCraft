"use client";

import {
  CalendarCheck,
  LayoutDashboard,
  ListVideo,
  LogOut,
  Menu,
  PlusCircle,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ModeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut, useSession } from "@/lib/auth-client";
import { getInitials } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/#about-us" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [activeHash, setActiveHash] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // REAL SESSION STATE via BetterAuth
  const { data, isPending } = useSession();
  const user = data?.user;
  const isAuthenticated = Boolean(user);

  const scrollToSection = useCallback((sectionId: string) => {
    const target =
      document.getElementById(sectionId) ||
      (sectionId === "about-us" ? document.getElementById("about") : null);

    if (!target) return false;

    const navbarOffset = 72;
    const top =
      target.getBoundingClientRect().top + window.scrollY - navbarOffset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    return true;
  }, []);

  // Handle cross-page hash navigation (e.g., clicking /#about-us from /studios)
  useEffect(() => {
    if (pathname !== "/") {
      setActiveHash("");
      return;
    }

    const currentHash = window.location.hash;
    if (currentHash === "#how-it-works" || currentHash === "#about-us") {
      const sectionId = currentHash.slice(1);
      setActiveHash(currentHash);

      // Retry briefly so async sections (like FeaturedStudios) don't shift the target
      const t1 = setTimeout(() => scrollToSection(sectionId), 80);
      const t2 = setTimeout(() => scrollToSection(sectionId), 350);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [pathname, scrollToSection]);

  // Update active section highlight dynamically as the user scrolls on Home
  useEffect(() => {
    if (pathname !== "/") return;

    function handleScroll() {
      const howEl = document.getElementById("how-it-works");
      const aboutEl =
        document.getElementById("about-us") || document.getElementById("about");

      const triggerLine = 220;
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 40;

      if (
        aboutEl &&
        (aboutEl.getBoundingClientRect().top <= triggerLine || nearBottom)
      ) {
        setActiveHash("#about-us");
      } else if (howEl && howEl.getBoundingClientRect().top <= triggerLine) {
        setActiveHash("#how-it-works");
      } else {
        setActiveHash("");
      }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    setMobileMenuOpen(false);

    if (href === "/" && pathname === "/") {
      e.preventDefault();
      setActiveHash("");
      window.history.pushState(null, "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (href.startsWith("/#")) {
      const hash = href.slice(1); // "#how-it-works" or "#about-us"
      const sectionId = hash.slice(1);

      if (pathname === "/") {
        e.preventDefault();
        setActiveHash(hash);
        window.history.pushState(null, "", href);
        scrollToSection(sectionId);
      } else {
        setActiveHash(hash);
      }
    }
  }

  function isLinkActive(href: string) {
    if (href === "/") {
      return pathname === "/" && activeHash === "";
    }
    if (href.startsWith("/#")) {
      return pathname === "/" && activeHash === href.slice(1);
    }
    if (href === "/studios") {
      return pathname === "/studios" || pathname.startsWith("/studios/");
    }
    return pathname === href;
  }

  // Highlight helper for the authenticated workspace menu items
  function isAuthLinkActive(href: string) {
    return pathname === href;
  }

  async function handleSignOut() {
    setMobileMenuOpen(false);
    await signOut({
      fetchOptions: {
        onSuccess: () => router.push("/"),
      },
    });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between">
        {/* LEFT: Dual Logo Setup */}
        <Link
          href="/"
          onClick={(e) => handleNavClick(e, "/")}
          className="flex items-center gap-2"
        >
          <div className="relative h-10 w-52">
            {/* LIGHT THEME LOGO: Hidden in dark mode */}
            <Image
              src="/logo-lightt.png"
              alt="SpaceCraft Logo"
              fill
              className="object-contain dark:hidden"
              priority
            />
            {/* DARK THEME LOGO: Hidden in light mode */}
            <Image
              src="/logo-darkk.png"
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
            const isActive = isLinkActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
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
            {isPending ? (
              <div
                className="h-9 w-28 animate-pulse rounded-md bg-muted"
                aria-hidden="true"
              />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={`flex items-center gap-2 rounded-full border bg-background py-1 pr-3 pl-1 transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 ${
                    isAuthLinkActive("/dashboard") ||
                    isAuthLinkActive("/add-studio") ||
                    isAuthLinkActive("/my-studios") ||
                    isAuthLinkActive("/my-bookings") ||
                    isAuthLinkActive("/profile")
                      ? "border-indigo-600/60"
                      : "border-input"
                  }`}
                >
                  <Avatar className="h-7 w-7 border border-border">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                    />
                    <AvatarFallback className="bg-indigo-100 text-xs font-heading font-bold text-indigo-700">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-28 truncate text-sm font-medium">
                    {user.name}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-2 py-1.5">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {user.name}
                      </p>
                      <p className="truncate text-xs font-normal text-muted-foreground">
                        {user.email}
                      </p>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    render={
                      <Link
                        href="/dashboard"
                        className={`cursor-pointer ${
                          isAuthLinkActive("/dashboard")
                            ? "font-semibold text-indigo-600"
                            : "font-medium"
                        }`}
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                      </Link>
                    }
                  />
                  <DropdownMenuItem
                    render={
                      <Link
                        href="/add-studio"
                        className={`cursor-pointer ${
                          isAuthLinkActive("/add-studio")
                            ? "font-semibold text-indigo-600"
                            : "font-medium"
                        }`}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Studio
                      </Link>
                    }
                  />
                  <DropdownMenuItem
                    render={
                      <Link
                        href="/my-studios"
                        className={`cursor-pointer ${
                          isAuthLinkActive("/my-studios")
                            ? "font-semibold text-indigo-600"
                            : "font-medium"
                        }`}
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
                        className={`cursor-pointer ${
                          isAuthLinkActive("/my-bookings")
                            ? "font-semibold text-indigo-600"
                            : "font-medium"
                        }`}
                      >
                        <CalendarCheck className="mr-2 h-4 w-4" /> My Bookings
                      </Link>
                    }
                  />
                  <DropdownMenuItem
                    render={
                      <Link
                        href="/profile"
                        className={`cursor-pointer ${
                          isAuthLinkActive("/profile")
                            ? "font-semibold text-indigo-600"
                            : "font-medium"
                        }`}
                      >
                        <User className="mr-2 h-4 w-4" /> Profile Settings
                      </Link>
                    }
                  />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer font-medium"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger className="md:hidden p-2 rounded-md hover:bg-accent text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
              <nav className="flex flex-col gap-4 mt-8">
                {NAV_LINKS.map((link) => {
                  const isActive = isLinkActive(link.href);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`text-lg font-medium font-heading transition-colors hover:text-indigo-600 ${
                        isActive ? "text-indigo-600" : ""
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-auto flex flex-col gap-4 border-t pt-6">
                {isPending ? null : isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage
                          src={user.image ?? undefined}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                        />
                        <AvatarFallback className="bg-indigo-100 text-xs font-heading font-bold text-indigo-700">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center text-lg font-medium ${
                        isAuthLinkActive("/dashboard")
                          ? "font-semibold text-indigo-600"
                          : ""
                      }`}
                    >
                      <LayoutDashboard className="mr-2 h-5 w-5 text-indigo-600" />
                      Dashboard
                    </Link>
                    <Link
                      href="/add-studio"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center text-lg font-medium ${
                        isAuthLinkActive("/add-studio")
                          ? "font-semibold text-indigo-600"
                          : ""
                      }`}
                    >
                      <PlusCircle className="mr-2 h-5 w-5 text-indigo-600" />{" "}
                      Add New Studio
                    </Link>
                    <Link
                      href="/my-studios"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center text-lg font-medium ${
                        isAuthLinkActive("/my-studios")
                          ? "font-semibold text-indigo-600"
                          : ""
                      }`}
                    >
                      <ListVideo className="mr-2 h-5 w-5 text-indigo-600" /> My
                      Studio Listings
                    </Link>
                    <Link
                      href="/my-bookings"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center text-lg font-medium ${
                        isAuthLinkActive("/my-bookings")
                          ? "font-semibold text-indigo-600"
                          : ""
                      }`}
                    >
                      <CalendarCheck className="mr-2 h-5 w-5 text-indigo-600" />
                      My Bookings
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center text-lg font-medium ${
                        isAuthLinkActive("/profile")
                          ? "font-semibold text-indigo-600"
                          : ""
                      }`}
                    >
                      <User className="mr-2 h-5 w-5 text-indigo-600" /> Profile
                      Settings
                    </Link>
                    <Button
                      variant="destructive"
                      className="w-full mt-4"
                      onClick={handleSignOut}
                    >
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="ghost" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                        Register
                      </Button>
                    </Link>
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
