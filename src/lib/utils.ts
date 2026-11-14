export { cn } from "cn";

// Derive up to two uppercase initials from a display name for Avatar fallbacks
export function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
