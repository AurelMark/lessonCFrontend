"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/componentsUI/button";
import { CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ExamAttempts } from "@/validation/exams";
import { TIME } from "@/constants";
import { useTranslations } from "next-intl";

type AttemptsModalProps = {
  attempts: ExamAttempts[];
};

export function ClientExamsAnswer({ attempts }: AttemptsModalProps) {
  const lastAttempt =
    Array.isArray(attempts) && attempts.length > 0
      ? attempts[attempts.length - 1]
      : null;

  const t = useTranslations();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full">
          {t("learn.exam.showResult")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl w-full">
        <DialogHeader>
          <DialogTitle>{t("learn.exam.examResult")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-8 max-h-[60vh] overflow-auto">
          {!lastAttempt && (
            <div className="text-center text-muted-foreground">
              {t("learn.exam.noAttempts")}
            </div>
          )}
          {lastAttempt && (
            <div className="flex flex-col items-center justify-center">
              <span className="text-muted-foreground text-sm mb-2">
                {format(new Date(lastAttempt.submittedAt), TIME)}
              </span>
              <div className="mb-4">
                <span className="mr-2">Счёт:</span>
                <span className="font-bold">
                  {lastAttempt.score} / {lastAttempt.answers.length}
                </span>
              </div>
              <div className="flex gap-4 flex-wrap justify-center">
                {lastAttempt.answers.map((ans) => (
                  <div
                    key={ans.id}
                    className="flex flex-col items-center gap-1"
                  >
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
                      {t("learn.exam.question")} {ans.questionIndex + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
