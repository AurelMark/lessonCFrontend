import { Button } from "@/componentsUI/button";
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/componentsUI/form";
import { Plus, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { LANG_TYPE } from "@/types";
import { ALERT_TYPES } from "@/constants";
import { CourseForm } from "@/validation/course";
import { Input } from "@/componentsUI/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/componentsUI/select";

type TAdminCourseAlert = {
  form: UseFormReturn<CourseForm>;
};

const LANGS = ["ro", "ru", "en"] as const;

export function AdminCourseAlert({ form }: TAdminCourseAlert) {
  const locale = useLocale() as LANG_TYPE;
  const t = useTranslations();

  const {
    fields: alertFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "alert",
  });

  const watchedAlerts =
    useWatch({
      control: form.control,
      name: "alert",
    }) || [];

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">
          {t("dashboard.adminCourse.alerts")}
        </span>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              type: "info",
              color: ALERT_TYPES[0].color,
              content: { ro: "", en: "", ru: "" },
            })
          }
        >
          <Plus /> {t("dashboard.adminCourse.addAlert")}
        </Button>
      </div>
      {alertFields.map((field, idx) => {
        const watchedAlert = watchedAlerts[idx] || {};
        return (
          <div key={field.id} className="flex flex-col my-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-end">
                <FormField
                  control={form.control}
                  name={`alert.${idx}.type`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        {t("dashboard.adminCourse.typeAlert")}
                      </FormLabel>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          const selected = ALERT_TYPES.find(
                            (a) => a.value === val
                          );
                          form.setValue(
                            `alert.${idx}.color`,
                            selected?.color || ""
                          );
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={t("dashboard.adminCourse.typeAlert")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ALERT_TYPES.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(idx)}
                  className="ml-2 mt-[22px]"
                >
                  <X />
                </Button>
              </div>
              {LANGS.map((lang) => (
                <FormField
                  key={lang}
                  control={form.control}
                  name={`alert.${idx}.content.${lang}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {`${t(
                          "dashboard.adminCourse.Content"
                        )} ${lang.toUpperCase()}`}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
            />
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <div
                className={`border ${
                  watchedAlert?.color ?? ""
                } px-4 py-2 rounded flex items-center gap-2`}
              >
                <span className="font-bold capitalize">
                  {watchedAlert?.type}
                </span>
                <span>{watchedAlert?.content?.[locale] || "-"}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
