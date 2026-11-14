"use client";

import { ListVideo, LogOut, Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
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

  // REAL SESSION STATE via BetterAuth
  const { data, isPending } = useSession();
  const user = data?.user;
  const isAuthenticated = Boolean(user);

  async function handleSignOut() {
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
            {isPending ? (
              // Avoid flashing the Login/Register buttons while the session loads
              <div
                className="h-9 w-28 animate-pulse rounded-md bg-muted"
                aria-hidden="true"
              />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-input bg-background py-1 pr-3 pl-1 transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
                  <Avatar className="h-7 w-7 border border-border">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name}
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
                  {/* Dropdown header: display name & email */}
                  <DropdownMenuLabel className="px-2 py-1.5">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs font-normal text-muted-foreground">
                      {user.email}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    render={
                      <Link
                        href="/profile"
                        className="cursor-pointer font-medium"
                      >
                        <User className="mr-2 h-4 w-4" /> Profile Settings
                      </Link>
                    }
                  />
                  <DropdownMenuItem
                    render={
                      <Link
                        href="/my-studios"
                        className="cursor-pointer font-medium"
                      >
                        <ListVideo className="mr-2 h-4 w-4" /> My Studios
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
                {isPending ? null : isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage
                          src={user.image ?? undefined}
                          alt={user.name}
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
                      href="/profile"
                      className="flex items-center text-lg font-medium"
                    >
                      <User className="mr-2 h-5 w-5 text-indigo-600" /> Profile
                      Settings
                    </Link>
                    <Link
                      href="/my-studios"
                      className="flex items-center text-lg font-medium"
                    >
                      <ListVideo className="mr-2 h-5 w-5 text-indigo-600" /> My
                      Studios
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
