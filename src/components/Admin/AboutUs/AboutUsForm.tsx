"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";
import {
  AboutUsResponse,
  AboutUsValidation,
  AboutUsValidationSchema,
} from "@/validation/aboutUs";
import { updateAboutUs } from "@/api/aboutUs";
import { AboutFormTabs } from "./AboutUsFormTabs";

type TAboutUsFormProps = {
  data: AboutUsResponse;
};

export default function AboutUsForm({ data }: TAboutUsFormProps) {
  const t = useTranslations("homepage.aboutUs");
  const queryClient = useQueryClient();
  const form = useForm<AboutUsValidation>({
    resolver: zodResolver(AboutUsValidationSchema),
    defaultValues: {
      title: {
        ro: "",
        ru: "",
        en: "",
      },
      context: {
        ro: "",
        ru: "",
        en: "",
      },
    },
  });

  useEffect(() => {
    form.reset(data);
  }, [form, data]);

  const updateMutation = useMutation({
    mutationFn: updateAboutUs,
    onSuccess: () => {
      toast.success(
        <>
          <div className="font-bold">{t("updateSuccess")}</div>
        </>
      );
      queryClient.invalidateQueries({ queryKey: ["getAboutUsData"] });
    },
    onError: () => {
      toast.error(t("updateError"));
    },
  });

  const handleSubmitData = (data: AboutUsValidation) => {
    updateMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmitData)}
        className="space-y-8"
      >
        <div className="flex flex-col justify-center gap-4">
          <AboutFormTabs form={form} />
          <Button type="submit">
            {updateMutation.isPending ? (
              <>
                <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-current rounded-full inline-block align-middle" />
                {t("uploading")}
              </>
            ) : (
              t("save")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
