import { ArrowLeft, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] px-4 py-16 text-center w-full">
      {/* 404 Diorama Illustration */}
      <div className="relative w-full max-w-lg aspect-[4/3] mb-4 rounded-xl overflow-hidden">
        <Image
          src="/404-image.png"
          alt="404 - Space Not Found"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Error Copy */}
      <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight mb-4">
        Space Not Found
      </h1>
      <p className="text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
        It looks like this studio space is currently offline or doesn't exist.
        Let's get you back to the main stage.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button
          asChild
          variant="outline"
          className="gap-2 w-full sm:w-auto h-11 px-6"
        >
          {/* Using window.history.back() behavior via a standard href fallback for simplicity, 
              though a router.back() could be used in a Client Component if preferred */}
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Link>
        </Button>
        <Button
          asChild
          className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto h-11 px-6"
        >
          <Link href="/">
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
