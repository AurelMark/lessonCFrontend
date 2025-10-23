import { useForm, UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/componentsUI/form";
import { Input } from "@/componentsUI/input";
import {
  CreateNews,
  CreateNewsTags,
  CreateNewsTagsSchema,
} from "@/validation/news";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/componentsUI/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/componentsUI/tooltip";
import { Delete, Plus } from "lucide-react";
import { Badge } from "@/componentsUI/badge";
import { toast } from "sonner";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LANG_TYPE } from "@/types";

type TAdminNewsFormProps = {
  form: UseFormReturn<CreateNews>;
};

export function AdminNewsTags({ form }: TAdminNewsFormProps) {
  const t = useTranslations("dashboard.adminNews");
  const locale = useLocale() as LANG_TYPE;

  const tagsState = form.watch("tags");
  const tagsError = (
    form.formState.errors.tags?.message as Record<string, string> | undefined
  )?.[locale];

  const formTags = useForm<CreateNewsTags>({
    resolver: zodResolver(CreateNewsTagsSchema),
    defaultValues: {
      tag: "",
    },
  });

  useEffect(() => {
    if (tagsError) {
      formTags.setError("tag", {
        type: "manual",
        message: tagsError,
      });
    } else {
      formTags.clearErrors("tag");
    }
  }, [tagsError, formTags]);

  const handleSubmit = (data: CreateNewsTags) => {
    if (tagsState.includes(data.tag)) {
      toast.error(t("existTag"));
    } else {
      form.setValue("tags", [...tagsState, data.tag]);
      formTags.reset();
    }
  };

  const removeTag = (tag: string) =>
    form.setValue(
      "tags",
      tagsState.filter((t) => t !== tag)
    );

  return (
    <Form {...formTags}>
      <form
        onSubmit={formTags.handleSubmit(handleSubmit)}
        className="space-y-4 my-4"
      >
        <div className="grid grid-cols-[1fr_2.5rem] gap-x-4 ">
          <FormField
            control={formTags.control}
            name="tag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("tags")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" size="icon" className="!mt-5">
                  <Plus className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("addTag")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex flex-wrap gap-4 mt-2">
          {tagsState.map((tag) => (
            <Badge variant="outline" className="gap-1 text-sm" key={tag}>
              <span>{tag}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="p-0 ml-1"
                      onClick={() => removeTag(tag)}
                      tabIndex={-1}
                    >
                      <Delete className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("removeTag")}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Badge>
          ))}
        </div>
      </form>
    </Form>
  );
}
