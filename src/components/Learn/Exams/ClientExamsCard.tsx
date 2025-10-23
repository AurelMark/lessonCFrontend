"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { LANG_TYPE } from "@/types";
import { User } from "lucide-react";
import { Exams } from "@/validation/exams";
import { useState } from "react";
import { Button } from "@/componentsUI/button";
import { ClientExamsQuestion } from "./ClientExamsQuestion";

type TClientExamsCardProps = {
  data: Exams;
};

export function ClientExamsCard({ data }: TClientExamsCardProps) {
  const locale = useLocale() as LANG_TYPE;
  const t = useTranslations();
  const [startExams, setStartExams] = useState(false);
  const examId = data.id;

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full mx-auto bg-background rounded-2xl shadow-md overflow-hidden">
        {data.imageUrl && (
          <div className="relative w-full h-48">
            <Image
              src={data.imageUrl}
              alt={data.title[locale]}
              fill
              className="object-cover"
              priority
              unoptimized
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
        <div className="p-6 flex flex-col gap-4">
          <h1 className="text-2xl font-bold mb-1">{data.title[locale]}</h1>
          <div className="text-muted-foreground">
            {data.description[locale]}
          </div>
          <div className="flex flex-col gap-1 text-sm mt-2">
            {data.responsible?.length > 0 && (
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>
                  {t("dashboard.adminExams.responsible")}:{" "}
                  {data.responsible
                    .map((r) => `${r.firstName} ${r.lastName}`)
                    .join(", ")}
                </span>
              </div>
            )}
          </div>
          {data.content?.[locale] && (
            <div
              className="mt-4 max-w-full prose prose-a:text-blue-600 prose-a:underline prose-a:transition-all hover:prose-a:text-blue-800"
              dangerouslySetInnerHTML={{ __html: data.content[locale] }}
            />
          )}
        </div>
      </div>
      <div className="w-full mx-auto bg-background rounded-2xl shadow-md p-6">
        {!startExams ? (
          <div className="flex justify-center flex-col gap-4">
            <h3 className="text-center">{t("learn.exam.onStartExamClick")}</h3>
            <Button onClick={() => setStartExams(true)}>
              {t("learn.exam.startExam")}
            </Button>
          </div>
        ) : (
          data.questions &&
          examId && (
            <ClientExamsQuestion examId={examId} questions={data.questions} />
          )
        )}
      </div>
    </div>
  );
}
