"use client";

import Image from "next/image";
import Link from "next/link";
import { CourseEvent } from "@/validation/course";
import { useLocale, useTranslations } from "use-intl";
import { LANG_TYPE } from "@/types";
import { cn } from "@/lib/utils";
import { BookOpenIcon, ChevronsLeft, ChevronsRight } from "lucide-react";
import { buttonVariants } from "@/componentsUI/button";

type Props = {
  course: CourseEvent;
  idx: number;
};

export function CourseCard({ course, idx }: Props) {
  const locale = useLocale() as LANG_TYPE;
  const t = useTranslations();

  const isImageLeft = idx % 2 === 0;

  return (
    <section className="w-full py-8">
      <div
        className={cn(
          "flex flex-col-reverse items-center gap-8 md:gap-12 md:flex-row",
          !isImageLeft && "md:flex-row-reverse"
        )}
      >
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-full h-52 md:h-72 max-w-xl">
            <Image
              src={course.imageUrl}
              alt={course.title[locale]}
              fill
              className="object-cover rounded-2xl shadow"
              priority={idx === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start max-w-xl">
          <div className="flex items-start gap-5 mb-2">
            <BookOpenIcon className="w-6 h-6 text-primary mt-2" />
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              {course.title[locale]}
            </h3>
          </div>

          <p className="text-base md:text-lg mb-4 text-muted-foreground">
            {course.description[locale]}
          </p>
          <Link
            href={`/${locale}/courses/${course.slug}`}
            className={cn(
              buttonVariants({ variant: "default" }),
              "rounded-full group transform transition-transform duration-300 hover:scale-[1.01] hover:shadow-md"
            )}
          >
            {isImageLeft && (
              <ChevronsLeft className="transition-transform duration-300 group-hover:translate-x-1" />
            )}
            <span className="mr-2">{t("more")}</span>
            {!isImageLeft && (
              <ChevronsRight className="transition-transform duration-300 group-hover:-translate-x-1" />
            )}
          </Link>
        </div>
      </div>
    </section>
  );
}
