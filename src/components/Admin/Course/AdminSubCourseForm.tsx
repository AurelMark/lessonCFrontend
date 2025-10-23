import { FieldValues, Path, UseFormReturn } from "react-hook-form";
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

type TSubcourseFormCreateForm<T extends FieldValues> = {
  form: UseFormReturn<T>;
  handleSubmit: (data: T) => void;
  locale: "ro" | "ru" | "en";
};

export function SubcourseFormCreateForm<T extends FieldValues>({
  form,
  handleSubmit,
  locale,
}: TSubcourseFormCreateForm<T>) {
  const t = useTranslations("dashboard.adminSubcourse");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 my-4"
      >
        <FormField
          control={form.control}
          name={`title.${locale}` as Path<T>}
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
          name={`description.${locale}` as Path<T>}
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
      </form>
    </Form>
  );
}
