"use client";

import { Button } from "@/componentsUI/button";
import { Trash2, PlusCircle, GripVertical } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ExamsForm } from "@/validation/exams";
import { QuillControlled } from "@/custom//QuillControlled";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/componentsUI/form";
import { Input } from "@/componentsUI/input";
import { LANG_TYPE } from "@/types";
import { getLocaleMessage } from "@/lib/getLocaleMessageValidation";

type TAdminExamsQuestionsProps = {
  form: UseFormReturn<ExamsForm>;
};

export function AdminExamsQuestions({ form }: TAdminExamsQuestionsProps) {
  const t = useTranslations("dashboard.adminExams");

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
    move: moveQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = questionFields.findIndex((i) => i.id === active.id);
      const newIndex = questionFields.findIndex((i) => i.id === over.id);
      moveQuestion(oldIndex, newIndex);
      const updatedQuestions = form.getValues("questions").map((q, i) => ({
        ...q,
        order: i,
      }));
      form.setValue("questions", updatedQuestions);
    }
  };

  const handleAddQuestion = () => {
    appendQuestion({
      id: nanoid(),
      title: "",
      options: [
        { content: "", isAnswer: false, order: 0 },
        { content: "", isAnswer: false, order: 1 },
      ],
    });
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium">{t("questionsTitle")}</h2>
        <Button type="button" variant="outline" onClick={handleAddQuestion}>
          <PlusCircle className="mr-1" size={18} />
          {t("addQuestion")}
        </Button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={questionFields.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          {questionFields.length === 0 && (
            <div className="text-center text-muted-foreground py-8 text-red-600">
              {t("noQuestions")}
            </div>
          )}
          {questionFields.map((q, idx) => (
            <QuestionDraggableWrapper
              key={q.id}
              id={q.id}
              qIndex={idx}
              form={form}
              removeQuestion={() => removeQuestion(idx)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

function QuestionDraggableWrapper({
  id,
  qIndex,
  form,
  removeQuestion,
}: {
  id: string;
  qIndex: number;
  form: UseFormReturn<ExamsForm>;
  removeQuestion: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        marginBottom: "16px",
      }}
      className={cn(
        "relative border rounded-xl bg-muted/50 p-4 transition",
        isDragging && "opacity-50 ring-2 ring-primary"
      )}
    >
      <span
        {...listeners}
        {...attributes}
        className="cursor-grab mr-2 p-1 rounded hover:bg-accent absolute left-2 top-2 z-10"
        tabIndex={-1}
      >
        <GripVertical size={18} />
      </span>
      <div className="ml-8">
        <QuestionBlock
          qIndex={qIndex}
          form={form}
          removeQuestion={removeQuestion}
        />
      </div>
    </div>
  );
}

function QuestionBlock({
  qIndex,
  form,
  removeQuestion,
}: {
  qIndex: number;
  form: UseFormReturn<ExamsForm>;
  removeQuestion: () => void;
}) {
  const t = useTranslations("dashboard.adminExams");
  const {
    fields: optionFields,
    append: appendOption,
    update: updateOption,
    remove: removeOption,
  } = useFieldArray({
    control: form.control,
    name: `questions.${qIndex}.options`,
  });
  const locale = useLocale() as LANG_TYPE;

  const handleOptionChange = (selectedIdx: number) => {
    const currentOptions = form.getValues(`questions.${qIndex}.options`);
    currentOptions.forEach((option, i) => {
      updateOption(i, {
        ...option,
        isAnswer: i === selectedIdx,
      });
    });
  };

  const handleAddOption = () => {
    appendOption({ content: "", isAnswer: false, order: optionFields.length });
  };

  return (
    <div>
      <Button
        type="button"
        size="icon"
        variant="destructive"
        className="absolute top-2 right-2"
        onClick={removeQuestion}
        aria-label={t("deleteQuestion")}
      >
        <Trash2 size={18} />
      </Button>
      <div className="mb-3 flex flex-col gap-2">
        <FormField
          control={form.control}
          name={`questions.${qIndex}.title`}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{t("questionLabel", { idx: qIndex + 1 })}</FormLabel>
              <FormControl>
                <div className={fieldState.invalid ? "ql-error" : ""}>
                  <QuillControlled
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <div className="font-medium mb-2">{t("answerOptions")}</div>
        <div className="flex flex-col gap-2">
          {optionFields.map((opt, oIdx) => (
            <div key={opt.id} className="flex items-center gap-3">
              <input
                type="radio"
                checked={optionFields[oIdx].isAnswer}
                onChange={() => handleOptionChange(oIdx)}
                name={`correct-${qIndex}`}
                className="accent-primary"
              />
              <FormField
                control={form.control}
                name={`questions.${qIndex}.options.${oIdx}.content`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("optionPlaceholder", { idx: oIdx + 1 })}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeOption(oIdx)}
                aria-label={t("deleteOption")}
                disabled={optionFields.length <= 2}
              >
                <Trash2 className="text-red-500" size={16} />
              </Button>
            </div>
          ))}
        </div>
        {form.formState.errors.questions?.[qIndex]?.options?.root?.message && (
          <div className="text-sm text-red-600">
            {getLocaleMessage(
              form.formState.errors.questions?.[qIndex]?.options?.root?.message,
              locale
            )}
          </div>
        )}

        <Button
          type="button"
          size="sm"
          className="mt-2"
          onClick={handleAddOption}
        >
          <PlusCircle className="mr-1" size={16} />
          {t("addOption")}
        </Button>
      </div>
    </div>
  );
}
