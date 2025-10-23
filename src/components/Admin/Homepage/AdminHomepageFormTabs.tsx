import { FieldErrors, useFieldArray, UseFormReturn } from "react-hook-form";
import { Button } from "@/componentsUI/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/componentsUI/form";
import { Input } from "@/componentsUI/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/componentsUI/tabs";
import { Textarea } from "@/componentsUI/textarea";
import { Plus, Trash2 } from "lucide-react";
import { HomepageForm } from "@/validation/homepage";
import { LANG_TYPE } from "@/constants";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useUploadsStore } from "@/store/useUploadsStore";
import { useEffect, useState } from "react";
import { UploadSimpleDialog } from "../Uploads/UploadsHomepageSimple";
import Image from "next/image";

type TAdminHomePageFormTabsProps = {
  type: "slider" | "education" | "info";
  form: UseFormReturn<HomepageForm>;
  title: string;
};

type FieldName =
  | `slider.${number}.title.ro`
  | `slider.${number}.title.ru`
  | `slider.${number}.title.en`
  | `info.${number}.title.ro`
  | `info.${number}.title.ru`
  | `info.${number}.title.en`
  | `education.${number}.title.ro`
  | `education.${number}.title.ru`
  | `education.${number}.title.en`
  | `slider.${number}.description.ro`
  | `slider.${number}.description.ru`
  | `slider.${number}.description.en`
  | `info.${number}.description.ro`
  | `info.${number}.description.ru`
  | `info.${number}.description.en`
  | `education.${number}.description.ro`
  | `education.${number}.description.ru`
  | `education.${number}.description.en`;

export const AdminHomePageFormTabs = ({
  type,
  form,
  title,
}: TAdminHomePageFormTabsProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: type,
  });
  const t = useTranslations("homepage");
  // const setOpen = useUploadsStore((state) => state.setOpen);
  const selectedUrl = useUploadsStore((state) => state.selectedUrl);
  const setUrl = useUploadsStore((state) => state.setUrl);
  const setSelectedUrl = useUploadsStore((state) => state.setSelectedUrl);
  const errors = form.formState.errors as FieldErrors<HomepageForm>;
  const arrayError = errors[type];
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedUrl) {
      const idx = form.getValues(type).findIndex((el) => !el.imageUrl);
      if (idx !== -1) {
        form.setValue(`${type}.${idx}.imageUrl`, selectedUrl);
      }
      setSelectedUrl(null);
    }
  }, [selectedUrl, form, setSelectedUrl, type]);

  function hasLangError(
    type: "slider" | "education" | "info",
    idx: number,
    lang: string
  ) {
    const arr = errors[type];
    if (!arr || !Array.isArray(arr) || !arr[idx]) return false;
    const titleError = arr[idx]?.title as Record<string, unknown> | undefined;
    const descriptionError = arr[idx]?.description as
      | Record<string, unknown>
      | undefined;
    return !!titleError?.[lang] || !!descriptionError?.[lang];
  }

  // const handleOpenFolder = () => {
  //   setOpen(true);
  //   setUrl("/uploads/public/homepage");
  //   setType("public");
  // };

  const handleRemoveElement = async (idx: number) => {
    remove(idx);
    await form.trigger(type);
  };

  const handleOpenUpload = () => {
    setUrl(`/uploads/public/homepage`);
    setOpen(true);
  };

  return (
    <>
      <div className="mb-6 flex items-center gap-2">
        <span className="text-xl font-semibold">{t(title)}</span>
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() =>
            append({
              title: { ro: "", ru: "", en: "" },
              description: { ro: "", ru: "", en: "" },
              imageUrl: "",
              link: "",
            })
          }
        >
          <Plus />
        </Button>
      </div>
      {form.formState.isSubmitted &&
        arrayError &&
        !Array.isArray(arrayError) &&
        typeof arrayError.message === "object" && (
          <div className="text-destructive mb-3 text-sm">
            {arrayError.message[locale]}
          </div>
        )}
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
                      hasLangError(type, idx, lang) &&
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
                      name={`${type}.${idx}.title.${lang}` as FieldName}
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
                      name={`${type}.${idx}.description.${lang}` as FieldName}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("description")} ({lang})
                          </FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={6} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            <div className="grid grid-cols-[160px_1fr] gap-4">
              <FormField
                control={form.control}
                name={`${type}.${idx}.imageUrl`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("imageUrl")}</FormLabel>
                    <div className="flex items-center gap-4">
                      {field.value ? (
                        <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                          <Image
                            fill
                            src={field.value}
                            alt="preview"
                            className="object-cover w-full h-full"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute top-1 right-1 rounded-full w-6 h-6"
                            onClick={() => field.onChange("")}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          onClick={() => handleOpenUpload()}
                          className="w-24 h-24 flex items-center justify-center rounded-md border-2 border-dashed cursor-pointer hover:bg-accent transition"
                        >
                          <Plus className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`${type}.${idx}.link`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("link")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-center gap-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleRemoveElement(idx)}
              >
                {t("delete")} <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <UploadSimpleDialog open={open} setOpen={setOpen} />
    </>
  );
};
