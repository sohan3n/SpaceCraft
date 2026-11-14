import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Suspense } from "react";

// 1. Configure standard body font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// 2. Configure modern heading font
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "StudioSpace | Peer-to-Peer Creative Workspaces",
  description: "Discover and book photography, film, and podcast studios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      // 3. Inject variables here
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="antialiased font-sans bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense
            fallback={
              <header className="h-16 w-full border-b bg-background/80" />
            }
          >
            <Navbar />
          </Suspense>
          {children}
          <Footer />
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
