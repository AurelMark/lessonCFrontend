"use client";
import Image from "next/image";
import { LANG_TYPE } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import { BookOpen, Eye } from "lucide-react";
import { LessonZod } from "@/validation/lesson";
import { LessonMaterialsViewer } from "./ClientLessonViewer";

type Props = {
  lesson: LessonZod;
};

export function LessonInfoCard({ lesson }: Props) {
  const locale = useLocale() as LANG_TYPE;
  const t = useTranslations();

  return (
    <div className="max-w-[1200px] mx-auto bg-background rounded-2xl shadow-lg p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <div className="relative w-full bg-muted rounded-xl overflow-hidden flex-shrink-0 aspect-[4/3]">
          {lesson.imageUrl ? (
            <Image
              src={lesson.imageUrl}
              alt={lesson.title[locale]}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 25vw"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <BookOpen size={48} />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <h2 className="text-2xl font-bold">{lesson.title[locale]}</h2>
          <div className="text-muted-foreground text-sm mt-2">
            {lesson.description[locale]}
          </div>
        </div>
      </div>

      <div
        className="prose-sm max-w-none prose prose-a:text-blue-600 prose-a:underline prose-a:transition-all hover:prose-a:text-blue-800"
        dangerouslySetInnerHTML={{ __html: lesson.content[locale] }}
      />

      <div className="flex flex-col sm:flex-row gap-3 text-xs text-muted-foreground items-start sm:items-center">
        {lesson.examen &&
          Array.isArray(lesson.examen) &&
          lesson.examen.length > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {t("lesson.hasExam")}
            </span>
          )}
      </div>
      <LessonMaterialsViewer
        materials={lesson.materials || []}
        imageUrl={lesson.imageUrl}
      />
    </div>
  );
}
