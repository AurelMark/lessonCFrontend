import { FieldErrors, useFieldArray, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { LANG_TYPE } from "@/constants";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { FAQFormWrapper } from "@/validation/faq";
import { LANG_TYPE as LANG_TYPE_TS } from "@/types";
import { QuillControlled } from "@/custom//QuillControlled";

type TAdminFAQTabsProps = {
  form: UseFormReturn<FAQFormWrapper>;
};

export const AdminFAQTabs = ({ form }: TAdminFAQTabsProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  type FieldName =
    | `faqs.${number}.title.${LANG_TYPE_TS}`
    | `faqs.${number}.question.${LANG_TYPE_TS}`
    | `faqs.${number}.answer.${LANG_TYPE_TS}`;

  const t = useTranslations("faq");
  const errors = form.formState.errors as FieldErrors<FAQFormWrapper>;

  function hasLangError(idx: number, lang: string) {
    const arr = errors.faqs;
    if (!arr || !Array.isArray(arr) || !arr[idx]) return false;
    const titleError = arr[idx]?.title as Record<string, unknown> | undefined;
    const questionError = arr[idx]?.question as
      | Record<string, unknown>
      | undefined;
    const answerError = arr[idx]?.answer as Record<string, unknown> | undefined;
    return (
      !!titleError?.[lang] || !!questionError?.[lang] || !!answerError?.[lang]
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center gap-2">
        <span className="text-xl font-semibold">{t("faqList")}</span>
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() =>
            append({
              title: { ro: "", ru: "", en: "" },
              question: { ro: "", ru: "", en: "" },
              answer: { ro: "", ru: "", en: "" },
            })
          }
        >
          <Plus />
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="text-muted-foreground italic">{t("noItems")}</div>
      )}

      <div className="space-y-8">
        {fields.map((item, idx) => (
          <div
            key={item.id}
            className="border rounded-xl p-6 bg-background space-y-6"
          >
            <Tabs defaultValue="ro" className="w-full">
              <TabsList className="w-full flex">
                {LANG_TYPE.map((lang) => (
                  <TabsTrigger
                    key={lang}
                    value={lang}
                    className={cn(
                      "flex-1",
                      hasLangError(idx, lang) &&
                        "bg-red-500/40 text-white data-[state=active]:!bg-red-500"
                    )}
                  >
                    {lang}
                  </TabsTrigger>
                ))}
              </TabsList>

              {LANG_TYPE.map((lang) => (
                <TabsContent value={lang} key={lang}>
                  <div className="grid grid-cols-1 gap-4 mt-6">
                    <FormField
                      control={form.control}
                      name={`faqs.${idx}.title.${lang}` as FieldName}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("title")} ({lang})
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`faqs.${idx}.question.${lang}` as FieldName}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("question")} ({lang})
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="mb-3 flex flex-col gap-2">
                      <FormField
                        control={form.control}
                        name={`faqs.${idx}.answer.${lang}` as FieldName}
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>
                              {t("answer")} ({lang})
                            </FormLabel>
                            <FormControl>
                              <div
                                className={fieldState.invalid ? "ql-error" : ""}
                              >
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
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="flex justify-center gap-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(idx)}
              >
                {t("delete")} <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
