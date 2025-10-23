"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/componentsUI/button";
import { ExamsAttemptResponse } from "@/validation/exams";
import { useLocale } from "next-intl";
import { LANG_TYPE } from "@/types";

type ClientExamsAttemptsListProps = {
  data: ExamsAttemptResponse[];
};

export function AdminExamsAttempts({ data }: ClientExamsAttemptsListProps) {
  const locale = useLocale() as LANG_TYPE;
  if (!data || !data.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Нет попыток экзаменов
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {data.map(({ title, attempt }, idx) => (
        <div
          key={attempt.id || idx}
          className="border rounded-2xl p-6 bg-background shadow"
        >
          <h2 className="font-semibold text-lg mb-2">{title[locale]}</h2>
          <div className="flex flex-col gap-4 mb-2">
            <span className="text-xs text-muted-foreground">
              {format(new Date(attempt.submittedAt), "dd.MM.yyyy HH:mm")}
            </span>
            <span className="text-sm">
              Пользователь:{" "}
              <span className="font-semibold">
                {attempt?.user?.firstName} {attempt?.user?.lastName}
              </span>{" "}
              ({attempt?.user?.email})
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2 text-base">
            <span>Счёт:</span>
            <span className="font-bold">
              {attempt.score} / {attempt.answers.length}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {attempt.answers.map((ans) => (
              <div key={ans.id} className="flex flex-col items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className={`rounded-full w-10 h-10 ${
                    ans.correct
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                  disabled
                >
                  {ans.correct ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <XCircle className="w-6 h-6" />
                  )}
                </Button>
                <span className="text-xs opacity-70">
                  Вопрос {ans.questionIndex + 1}
                </span>
              </div>
            ))}
            {!attempt.answers.length && (
              <span className="text-sm text-muted-foreground">Нет ответов</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
