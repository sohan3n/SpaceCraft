// import Image from "next/image";
// import Link from "next/link";
// import { MapPin, Star } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export interface StudioCardProps {
//   id: string;
//   title: string;
//   category: string;
//   price: number;
//   rating: number;
//   location: string;
//   image: string;
// }

// export function StudioCard({ id, title, category, price, rating, location, image }: StudioCardProps) {
//   return (
//     <div className="group flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-indigo-500/50">
//       {/* Image Container with Badges */}
//       <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
//         <Image
//           src={image}
//           alt={title}
//           fill
//           className="object-cover transition-transform duration-500 group-hover:scale-105"
//         />
//         {/* Category Badge */}
//         <div className="absolute left-3 top-3 rounded-md bg-zinc-950/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
//           {category}
//         </div>
//         {/* Rating Badge */}
//         <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-white/90 dark:bg-zinc-950/80 px-2 py-1 text-xs font-bold text-zinc-900 dark:text-white backdrop-blur-md shadow-sm">
//           <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
//           <span>{rating.toFixed(1)}</span>
//         </div>
//       </div>

//       {/* Content & Action */}
//       <div className="flex flex-1 flex-col p-5">
//         <div className="mb-2 flex items-start justify-between gap-4">
//           <h3 className="font-heading text-lg font-bold tracking-tight line-clamp-1">
//             {title}
//           </h3>
//         </div>
        
//         <div className="mb-4 flex items-center text-sm text-muted-foreground">
//           <MapPin className="mr-1 h-4 w-4 shrink-0" />
//           <span className="truncate">{location}</span>
//         </div>

//         <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
//           <div className="flex items-baseline gap-1">
//             <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">${price}</span>
//             <span className="text-xs font-medium text-muted-foreground">/ hr</span>
//           </div>
//           <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
//             <Link href={`/studios/${id}`}>View Details</Link>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }