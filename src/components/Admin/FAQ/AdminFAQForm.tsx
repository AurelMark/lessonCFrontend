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
  FAQArray,
  FAQFormWrapper,
  FAQFormWrapperSchema,
} from "@/validation/faq";
import { updateFAQ } from "@/api/faq";
import { AdminFAQTabs } from "./AdminFAQFormTabs";

type TAdminFAQFormProps = {
  data: FAQArray;
};

export default function AdminFAQForm({ data }: TAdminFAQFormProps) {
  const t = useTranslations("faq");
  const queryClient = useQueryClient();
  const form = useForm<FAQFormWrapper>({
    resolver: zodResolver(FAQFormWrapperSchema),
    defaultValues: {
      faqs: [],
    },
  });

  useEffect(() => {
    form.reset({ faqs: data ?? [] });
  }, [form, data]);

  const updateMutation = useMutation({
    mutationFn: updateFAQ,
    onSuccess: () => {
      toast.success(
        <>
          <div className="font-bold">{t("updateSuccess")}</div>
        </>
      );
      queryClient.invalidateQueries({ queryKey: ["getHomepageData"] });
    },
    onError: () => {
      toast.error(t("updateError"));
    },
  });

  const handleSubmitData = (data: FAQFormWrapper) => {
    updateMutation.mutate(data.faqs);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmitData)}
        className="space-y-8"
      >
        <AdminFAQTabs form={form} />
        <div className="flex justify-center gap-4">
          <Button type="submit">
            {updateMutation.isPending ? (
              <>
                <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-current rounded-full inline-block align-middle" />
                {t("Uploading")}
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
