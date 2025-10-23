import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/componentsUI/form";
import { Input } from "@/componentsUI/input";
import { useTranslations } from "next-intl";
import { QuillControlled } from "@/custom//QuillControlled";
import { LessonForm } from "@/validation/lesson";

type TAdminNewsFormProps = {
  form: UseFormReturn<LessonForm>;
  handleSubmit: (data: LessonForm) => void;
  locale: "ro" | "ru" | "en";
};

export function AdminNewsForm({
  form,
  handleSubmit,
  locale,
}: TAdminNewsFormProps) {
  const t = useTranslations("dashboard.adminNews");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 my-4"
      >
        <FormField
          control={form.control}
          name={`title.${locale}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Title")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`description.${locale}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Description")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`content.${locale}`}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{t("Content")}</FormLabel>
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
      </form>
    </Form>
  );
}
