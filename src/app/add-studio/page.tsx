"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Building2,
  Check,
  DollarSign,
  ImageIcon,
  Loader2,
  MapPin,
  Users,
} from "lucide-react";

const STUDIO_CATEGORIES = [
  "Photography",
  "Podcast",
  "Music",
  "Film",
  "Dance",
  "Art",
];

const AMENITY_OPTIONS = [
  "Wi-Fi",
  "Acoustic Treatment",
  "Lighting Kit",
  "Green Screen",
  "Air Conditioning",
  "Vocal Booth",
  "Camera Gear",
  "Parking",
  "Lounge Area",
  "Makeup Station",
];

const addStudioSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Studio title must be at least 3 characters." }),
  category: z
    .string()
    .min(1, { message: "Please select a studio category." }),
  location: z
    .string()
    .min(3, { message: "Please enter a city or neighborhood." }),
  description: z
    .string()
    .min(20, { message: "Describe your space and equipment in at least 20 characters." }),
  hourlyRate: z
    .string()
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
      message: "Enter a valid hourly rate greater than $0.",
    }),
  capacity: z
    .string()
    .refine((val) => Number.isInteger(Number(val)) && Number(val) >= 1, {
      message: "Capacity must be at least 1 person.",
    }),
  imageUrl: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.trim() === "" || /^https?:\/\/.+/.test(val.trim()),
      { message: "Please enter a valid http:// or https:// image URL." }
    ),
});

type AddStudioValues = z.infer<typeof addStudioSchema>;

export default function AddStudioPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "Wi-Fi",
    "Air Conditioning",
  ]);
  const [globalError, setGlobalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewBroken, setPreviewBroken] = useState(false);

  // Client-side session safety net
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  const form = useForm<AddStudioValues>({
    resolver: zodResolver(addStudioSchema),
    defaultValues: {
      title: "",
      category: "Photography",
      location: "",
      description: "",
      hourlyRate: "",
      capacity: "4",
      imageUrl: "",
    },
  });

  const watchedImageUrl = form.watch("imageUrl")?.trim() || "";
  const isValidPreviewUrl = /^https?:\/\/.+/.test(watchedImageUrl);

  function toggleAmenity(amenity: string) {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  }

  async function onSubmit(values: AddStudioValues) {
    setIsSubmitting(true);
    setGlobalError("");

    try {
      const response = await fetch("http://localhost:5000/api/studios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: values.title,
          category: values.category,
          location: values.location,
          description: values.description,
          hourlyRate: Number(values.hourlyRate),
          capacity: Number(values.capacity),
          amenities: selectedAmenities,
          images: values.imageUrl?.trim() ? [values.imageUrl.trim()] : [],
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setGlobalError(data.message || "Failed to publish studio listing.");
        setIsSubmitting(false);
        return;
      }

      router.push("/studios");
      router.refresh();
    } catch {
      setGlobalError("Network error: Could not connect to the SpaceCraft server.");
      setIsSubmitting(false);
    }
  }

  if (isPending) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="border-border/60 shadow-lg">
          <CardHeader className="space-y-2 border-b pb-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
              <Building2 className="h-3.5 w-3.5" />
              Host Dashboard
            </div>
            <CardTitle className="font-heading text-3xl font-bold tracking-tight">
              List Your Studio Space
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Publish your creative workspace on SpaceCraft so photographers, musicians,
              and content creators can book by the hour.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Studio Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Daylight Loft & Cyclorama Stage"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category & Location */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            {STUDIO_CATEGORIES.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              placeholder="e.g., Soho, New York"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Hourly Rate & Max Capacity */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="hourlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hourly Rate (USD)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              min="1"
                              step="1"
                              className="pl-9"
                              placeholder="65"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Guest / Crew Capacity</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Users className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              min="1"
                              step="1"
                              className="pl-9"
                              placeholder="8"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description & Equipment Details</FormLabel>
                      <FormControl>
                        <textarea
                          rows={4}
                          placeholder="Share square footage, natural light hours, included microphones/strobes, acoustic treatment, and house rules..."
                          className="flex min-h-[110px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Interactive Amenities Selector */}
                <div className="space-y-3">
                  <FormLabel>Included Amenities</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {AMENITY_OPTIONS.map((amenity) => {
                      const isSelected = selectedAmenities.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => toggleAmenity(amenity)}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-600 text-white"
                              : "border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                          {amenity}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Cover Image URL + Preview */}
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ImageIcon className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="url"
                            className="pl-9"
                            placeholder="https://images.unsplash.com/..."
                            {...field}
                            onChange={(e) => {
                              setPreviewBroken(false);
                              field.onChange(e);
                            }}
                          />
                        </div>
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Leave blank to automatically use a default studio cover photo.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isValidPreviewUrl && !previewBroken && (
                  <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
                    <img
                      src={watchedImageUrl}
                      alt="Studio preview"
                      className="h-48 w-full object-cover"
                      onError={() => setPreviewBroken(true)}
                    />
                  </div>
                )}

                {globalError && (
                  <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm font-medium text-destructive">
                    {globalError}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 border-t pt-6">
                  <Link href="/">
                    <Button type="button" variant="outline" disabled={isSubmitting}>
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publishing Studio...
                      </>
                    ) : (
                      "Publish Studio"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}