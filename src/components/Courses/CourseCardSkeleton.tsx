"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { BookOpenIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function CourseCardSkeleton() {
  return (
    <section className="w-full py-8">
      <div
        className={cn(
          "flex flex-col-reverse items-center gap-8 md:gap-12 md:flex-row"
        )}
      >
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-full h-52 md:h-72 max-w-xl">
            <Skeleton className="absolute inset-0 w-full h-full rounded-2xl" />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <BookOpenIcon className="w-6 h-6 text-muted" />
            <Skeleton className="h-8 w-48 md:w-64 rounded" />
          </div>
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-4/5 mb-2" />
          <Skeleton className="h-5 w-2/3 mb-4" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>
    </section>
  );
}
