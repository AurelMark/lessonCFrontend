import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LANG_TYPE } from "@/constants";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { QuillControlled } from "@/custom//QuillControlled";
import { AboutUsValidation } from "@/validation/aboutUs";

type TAdminFormTabsProps = {
  form: UseFormReturn<AboutUsValidation>;
};

export const AboutFormTabs = ({ form }: TAdminFormTabsProps) => {
  const t = useTranslations("homepage.aboutUs");
  const {
    formState: { errors },
  } = form;

  const hasLangError = (lang: string) => {
    return (
      errors.title?.[lang as keyof typeof errors.title] ||
      errors.context?.[lang as keyof typeof errors.context]
    );
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="ro" className="w-full">
        <TabsList className="w-full flex">
          {LANG_TYPE.map((lang) => (
            <TabsTrigger
              key={lang}
              value={lang}
              className={cn(
                "flex-1",
                hasLangError(lang) &&
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
                name={`title.${lang}` as `title.ro` | `title.ru` | `title.en`}
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
                name={
                  `context.${lang}` as
                    | `context.ro`
                    | `context.ru`
                    | `context.en`
                }
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      {t("context")} ({lang})
                    </FormLabel>
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
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
