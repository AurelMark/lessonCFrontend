"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  HomepageForm,
  HomepageFormSchema,
  HomepageResponseSchema,
} from "@/validation/homepage";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { AdminHomePageFormTabs } from "./AdminHomepageFormTabs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateHomepage } from "@/api/homepage";
import { toast } from "sonner";
import { useEffect } from "react";
import { FileExplorerModal } from "@/custom/Uploads";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/componentsUI/tabs";

type TAdminHomepageFormProps = {
  data: HomepageResponseSchema;
};

export default function AdminHomepageForm({ data }: TAdminHomepageFormProps) {
  const t = useTranslations("homepage");
  const queryClient = useQueryClient();
  const form = useForm<HomepageForm>({
    resolver: zodResolver(HomepageFormSchema),
    defaultValues: {
      slider: [],
      info: [],
      education: [],
    },
  });

  useEffect(() => {
    const { slider, education, info } = data;
    form.reset({
      slider: slider || [],
      education: education || [],
      info: info || [],
    });
  }, [form, data]);

  const updateMutation = useMutation({
    mutationFn: updateHomepage,
    onSuccess: () => {
      toast.success(
        <>
          <div className="font-bold">{t("updateSuccess")}</div>
        </>
      );
      queryClient.invalidateQueries({ queryKey: ["getHomepageData"] });
    },
  });

  const handleSubmitData = (data: HomepageForm) => {
    updateMutation.mutate(data);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmitData)}
          className="space-y-8"
        >
          <Tabs defaultValue="slider" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger
                className="bg-slate-500/40 text-white data-[state=active]:!bg-slate-500"
                value="slider"
              >
                {t("slider")}
              </TabsTrigger>
              <TabsTrigger
                className="bg-slate-500/40 text-white data-[state=active]:!bg-slate-500"
                value="education"
              >
                {t("education")}
              </TabsTrigger>
              <TabsTrigger
                className="bg-slate-500/40 text-white data-[state=active]:!bg-slate-500"
                value="info"
              >
                {t("info")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="slider">
              <AdminHomePageFormTabs form={form} type="slider" title="slider" />
            </TabsContent>
            <TabsContent value="education">
              <AdminHomePageFormTabs
                form={form}
                type="education"
                title="education"
              />
            </TabsContent>
            <TabsContent value="info">
              <AdminHomePageFormTabs form={form} type="info" title="info" />
            </TabsContent>
          </Tabs>
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
      <FileExplorerModal />
    </>
  );
}
