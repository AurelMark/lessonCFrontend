"use client";

import Image from "next/image";
import { Button } from "@/componentsUI/button";
import { Card } from "@/componentsUI/card";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { View, Users, BookOpen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/componentsUI/tooltip";
import { LANG_TYPE } from "@/types";
import { LessonArray } from "@/validation/lesson";

type TClientLessonListProps = {
  data: LessonArray;
};

export function ClientLessonList({ data }: TClientLessonListProps) {
  const locale = useLocale() as LANG_TYPE;
  const t = useTranslations();
  const router = useRouter();

  const handleToLearn = (slug: string) => {
    router.push(`/${locale}/dashboard/learn/lesson/${slug}`);
  };

  if (!data.length)
    return (
      <div className="text-muted-foreground text-center py-12">
        {t("dashboard.noLesson")}
      </div>
    );

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((item) => (
        <Card
          key={item.slug}
          className="flex flex-col h-full rounded-2xl shadow-md overflow-hidden bg-background"
        >
          <div className="relative h-40 w-full bg-muted">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.title[locale]}
                fill
                className="object-cover"
                unoptimized
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-3xl">
                <BookOpen size={40} />
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1 px-5 py-4 gap-3">
            <h2 className="font-bold text-lg line-clamp-2 min-h-[48px]">
              {item.title[locale]}
            </h2>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {item.description?.[locale]?.length
                ? item.description[locale]
                : t("dashboard.noDescription")}
            </p>

            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2 mb-1">
              {item.groups &&
                Array.isArray(item.groups) &&
                item.groups.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {item.groups
                      .map((g) =>
                        typeof g === "string" ? g : g.title?.[locale]
                      )
                      .join(", ")}
                  </span>
                )}
            </div>

            <div className="mt-auto pt-2 flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => item.slug && handleToLearn(item.slug)}
                    variant="default"
                    className="w-full py-2"
                  >
                    <View className="mr-2" />
                    {t("learn.lesson.startLearning")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("learn.lesson.startLearning")}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
