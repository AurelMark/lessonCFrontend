import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/componentsUI/card";
import { useLocale, useTranslations } from "next-intl";
import { Users, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { LANG_TYPE } from "@/types";
import { Exams } from "@/validation/exams";
import { ClientExamsAnswer } from "./ClientExamsAnswer";

type ClientExamListProps = {
  data: Exams[];
};

export function ClientExamList({ data }: ClientExamListProps) {
  const locale = useLocale() as LANG_TYPE;
  const t = useTranslations();
  const router = useRouter();

  const handleToExam = (slug: string) => {
    router.push(`/${locale}/dashboard/learn/exams/${slug}`);
  };

  if (!data.length)
    return (
      <div className="text-muted-foreground text-center py-12">
        {t("dashboard.noExams")}
      </div>
    );

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((exam) => (
        <Card
          key={exam.id}
          className="flex flex-col h-full rounded-2xl shadow-md overflow-hidden bg-background"
        >
          <div className="relative h-40 w-full bg-muted">
            {exam.imageUrl ? (
              <Image
                src={exam.imageUrl}
                alt={exam.title[locale]}
                fill
                className="object-cover"
                unoptimized
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-3xl">
                <FileText size={40} />
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1 px-5 py-4 gap-3">
            <h2 className="font-bold text-lg line-clamp-2 min-h-[48px]">
              {exam.title[locale]}
            </h2>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {exam.description?.[locale]?.length
                ? exam.description[locale]
                : t("dashboard.noDescription")}
            </p>

            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2 mb-1">
              {exam.groups &&
                Array.isArray(exam.groups) &&
                exam.groups.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {exam.groups
                      .map((g) =>
                        typeof g === "string" ? g : g.title?.[locale]
                      )
                      .join(", ")}
                  </span>
                )}
            </div>

            <div className="mt-auto pt-2 flex items-center">
              {Array.isArray(exam.attempts) && exam.attempts.length ? (
                <ClientExamsAnswer attempts={exam.attempts} />
              ) : (
                <Button
                  onClick={() => exam.slug && handleToExam(exam.slug)}
                  variant="default"
                  className="w-full py-2"
                >
                  {t("learn.exam.startExam")}
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
