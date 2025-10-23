"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  ExamsQuestions,
  SubmitExam,
  SubmitExamSchema,
} from "@/validation/exams";
import { useLocale, useTranslations } from "next-intl";
import { LANG_TYPE } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { submitAnswers } from "@/api/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useAuthStore";

type TClientExamsQuestionProps = {
  questions: ExamsQuestions[];
  examId: string;
};

const getZodMsg = (msg: string, locale: string, msgStandart: string) => {
  if (typeof msg === "object" && msg !== null && msg[locale])
    return msg[locale];
  if (typeof msg === "string") return msg;
  return msgStandart;
};

export function ClientExamsQuestion({
  questions,
  examId,
}: TClientExamsQuestionProps) {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale() as LANG_TYPE;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    Array(questions.length).fill(-1)
  );
  const [errorIndexes, setErrorIndexes] = useState<number[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const useUserStoreState = useUserStore((state) => state.user);
  const userId = useUserStoreState?.id as string;

  const validate = (arr: number[]) => {
    return arr
      .map((val, idx) => (val === -1 ? idx : -1))
      .filter((idx) => idx !== -1);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitClientExam = useMutation<any, Error, SubmitExam>({
    mutationFn: (data) => submitAnswers(data),
    onSuccess: () => {
      toast.success(t("learn.exam.examSentSuccess"));
      router.push(`/${locale}/dashboard/learn/exams`);
    },
    onError: () => {
      toast.error(t("learn.exam.examSentError"));
    },
  });

  const handleSelect = (optIdx: number) => {
    setAnswers((prev) => {
      const newArr = [...prev];
      newArr[current] = optIdx;
      setSubmitError(null);
      return newArr;
    });
  };

  const handlePrev = () => setCurrent((i) => Math.max(i - 1, 0));
  const handleNext = () =>
    setCurrent((i) => Math.min(i + 1, questions.length - 1));
  const handleIndicatorClick = (idx: number) => setCurrent(idx);

  const handleSubmit = () => {
    const answersForSubmit = answers.map(
      (selectedOptionIndex, questionIndex) => ({
        questionIndex,
        selectedOptionIndex,
      })
    );

    const payload = { examId, userId, answers: answersForSubmit };

    const res = SubmitExamSchema.safeParse(payload);

    if (!res.success) {
      const zodErr = res.error;

      let errMsg: string | undefined = undefined;
      if (zodErr.formErrors?.formErrors?.length) {
        errMsg = getZodMsg(
          zodErr.formErrors.formErrors[0],
          locale,
          t("learn.exam.validationErrorShort")
        );
      }
      if (!errMsg && zodErr.errors?.length) {
        const aErr = zodErr.errors.find(
          (e) => e.path[0] === "answers" && typeof e.message === "object"
        );
        if (aErr)
          errMsg = getZodMsg(
            aErr.message,
            locale,
            t("learn.exam.validationErrorShort")
          );
      }
      if (!errMsg && zodErr.errors?.length) {
        errMsg = getZodMsg(
          zodErr.errors[0].message,
          locale,
          t("learn.exam.validationErrorShort")
        );
      }
      if (!errMsg) {
        errMsg = t("learn.exam.validationErrorDetails");
      }
      setSubmitError(errMsg);
      setErrorIndexes(validate(answers));
      setCurrent(validate(answers)[0] ?? 0);
      return;
    }

    setSubmitError(null);
    submitClientExam.mutate(payload);
  };

  const q = questions[current];

  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="flex gap-2 mb-2">
        {questions.map((_, idx) => {
          let variant: "default" | "secondary" | "destructive" = "secondary";
          if (answers[idx] !== -1) variant = "default";
          if (errorIndexes.includes(idx)) variant = "destructive";
          return (
            <Button
              key={idx}
              variant={variant}
              size="icon"
              className={`w-10 h-10 rounded-full ${
                current === idx ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleIndicatorClick(idx)}
            >
              {idx + 1}
            </Button>
          );
        })}
      </div>

      <div className="flex items-start gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          disabled={current === 0}
        >
          <ChevronLeft />
        </Button>

        <div className="flex flex-col items-center gap-3 min-w-[220px]">
          <div className="font-semibold text-base mb-2 flex gap-2 items-center">
            <span className="opacity-60">
              {t("learn.exam.question")} {current + 1} / {questions.length}
            </span>
          </div>
          <div
            className="mb-4 text-center prose prose-a:text-blue-600 prose-a:underline prose-a:transition-all hover:prose-a:text-blue-800"
            dangerouslySetInnerHTML={{ __html: q.title }}
          />
          <div className="flex flex-col gap-3 w-full mx-4">
            {q.options.map((opt, optIdx) => (
              <Button
                key={optIdx}
                variant={answers[current] === optIdx ? "default" : "secondary"}
                className="w-full py-3 text-base"
                onClick={() => handleSelect(optIdx)}
              >
                {opt.content}
              </Button>
            ))}
          </div>
          {errorIndexes.includes(current) && (
            <div className="text-destructive mt-3 text-sm">
              {submitError ? submitError : t("learn.exam.pleaseSelectAnswer")}
            </div>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={current === questions.length - 1}
        >
          <ChevronRight />
        </Button>
      </div>

      <Button variant="default" onClick={handleSubmit}>
        {submitClientExam.isPending ? (
          <>
            <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-current rounded-full inline-block align-middle" />
            {t("dashboard.adminSubcourse.Uploading")}
          </>
        ) : (
          t("learn.exam.submitExam")
        )}
      </Button>
    </div>
  );
}
