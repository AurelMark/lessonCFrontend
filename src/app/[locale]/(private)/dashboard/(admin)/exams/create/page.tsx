"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { Button } from "@/componentsUI/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/componentsUI/tabs";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueries } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { SERVER_URL } from "@/constants";
import { LANG_TYPE } from "@/types";
import { cn } from "@/lib/utils";
import { uploadPrivateImage } from "@/api/uploads";
import { useUserStore } from "@/store/useAuthStore";

import { Switch } from "@/componentsUI/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/componentsUI/form";
import { MultiSelect } from "@/custom/MultiSelect";
import { CommonFormCreateForm } from "@/custom/CommonFormCreate";
import {
  getDictionaryGroups,
  getDictionaryLessons,
  getDictionaryUsers,
} from "@/api/dictionary";
import { AdminExamsImage } from "@/components/Admin/Exams/AdminExamsImage";
import { ExamsForm, ExamsFormSchema } from "@/validation/exams";
import { AdminExamsQuestions } from "@/components/Admin/Exams/AdminExamsQuestions";
import { createExams } from "@/api/exams";

type UploadExamsImageArgs = { file: File; slug: string };

export default function AdminExamsCreate() {
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;
  const [dataLessons, dataUsers, dataGroups] = useQueries({
    queries: [
      {
        queryKey: ["dic-lessons"],
        queryFn: getDictionaryLessons,
      },
      {
        queryKey: ["dic-users"],
        queryFn: getDictionaryUsers,
      },
      {
        queryKey: ["dic-groups"],
        queryFn: getDictionaryGroups,
      },
    ],
  });

  const dataLessonsOptions = dataLessons.data
    ? dataLessons.data.map((lesson) => ({
        label: lesson.title[locale],
        value: lesson.id,
      }))
    : [];

  const dataUsersOptions = dataUsers.data
    ? dataUsers.data.map((user) => ({
        label: `${user.firstName} ${user.lastName} - (${user.email})`,
        value: user.id,
      }))
    : [];
  const dataGroupsOptions = dataGroups.data
    ? dataGroups.data.map((group) => ({
        label: `${group.title[locale]}`,
        value: group.id,
      }))
    : [];

  const useUserStoreState = useUserStore((state) => state.user);
  const form = useForm<ExamsForm>({
    resolver: zodResolver(ExamsFormSchema),
    defaultValues: {
      title: { ro: "", en: "", ru: "" },
      description: { ro: "", en: "", ru: "" },
      content: { ro: "", en: "", ru: "" },
      imageUrl: "",
      slug: "",
      createdBy: "",
      groups: [],
      isActive: true,
      responsible: [],
      lessons: [],
      questions: [], 
      attempts: [],
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const errors = form.formState.errors;
  const errorRo =
    !!errors?.title?.ro || !!errors?.description?.ro || !!errors?.content?.ro;

  const errorRu =
    !!errors?.title?.ru || !!errors?.description?.ru || !!errors?.content?.ru;

  const errorEn =
    !!errors?.title?.en || !!errors?.description?.en || !!errors?.content?.en;

  useEffect(() => {
    if (useUserStoreState?.id) {
      (async () => {
        form.setValue("createdBy", useUserStoreState.id);
      })();
    }
  }, [form, useUserStoreState]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutation = useMutation<any, Error, UploadExamsImageArgs>({
    mutationFn: ({ file, slug }) => uploadPrivateImage(file, slug, "exams"),
    onMutate: () => {
      toast.loading(t("dashboard.adminExams.Uploading"), {
        id: "image-upload",
      });
    },
    onSuccess: (data) => {
      if (data.success && data.files && data.files.length > 0) {
        const filePath = data.files[0].path.replace(/\\/g, "/");
        const imageUrl = SERVER_URL + filePath;
        form.setValue("imageUrl", imageUrl);
      }
      toast.dismiss("image-upload");
      toast.success(t("dashboard.adminExams.UploadSuccess"));
    },
    onError: () => {
      toast.dismiss("image-upload");
      toast.error(t("dashboard.adminExams.UploadError"));
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createExamsMutation = useMutation<any, Error, ExamsForm>({
    mutationFn: (data) => createExams(data),
    onSuccess: () => {
      toast.success(t("dashboard.adminExams.ExamsCreatedSuccess"));
      router.push(`/${locale}/dashboard/exams`);
    },
    onError: () => {
      toast.error(t("dashboard.adminExams.ExamsCreateFailed"));
    },
  });

  const handleSubmit = async (data: ExamsForm) => {
    const currentSlug = form.watch("title.ro");
    const generatedSlug = slugify(currentSlug, {
      lower: true,
      strict: true,
      locale: "ro",
    });
    form.setValue("slug", generatedSlug);

    if (!selectedFile) {
      toast.error(t("dashboard.adminExams.UploadExamImage"));
      return;
    }

    await new Promise<void>((resolve, reject) => {
      mutation.mutate(
        { file: selectedFile, slug: generatedSlug || "" },
        {
          onSuccess: (uploadRes) => {
            if (uploadRes.success && uploadRes.files.length > 0) {
              const filePath = uploadRes.files[0].path.replace(/\\/g, "/");
              const imageUrl =
                SERVER_URL.replace(/\/$/, "") +
                "/" +
                filePath.replace(/^\/+/, "");
              form.setValue("imageUrl", imageUrl);
              resolve();
            } else {
              toast.error(t("dashboard.adminExams.UploadError"));
              reject();
            }
          },
          onError: () => {
            toast.error(t("dashboard.adminExams.UploadError"));
            reject();
          },
        }
      );
    });

    createExamsMutation.mutate({
      ...data,
      slug: generatedSlug,
      imageUrl: form.getValues("imageUrl") || "",
    });
  };

  return (
    <ContentLayout title="Exams">
      <div className="mb-4 bg-background px-4 py-8">
        <Tabs defaultValue="ro" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger
              value="ro"
              className={cn(
                errorRo &&
                  "bg-red-500/40 text-white data-[state=active]:!bg-red-500"
              )}
            >
              Ro
            </TabsTrigger>
            <TabsTrigger
              value="ru"
              className={cn(
                errorRu &&
                  "bg-red-500/40 text-white data-[state=active]:!bg-red-500"
              )}
            >
              Ru
            </TabsTrigger>
            <TabsTrigger
              value="en"
              className={cn(
                errorEn &&
                  "bg-red-500/40 text-white data-[state=active]:!bg-red-500"
              )}
            >
              En
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ro">
            <CommonFormCreateForm
              locale={"ro"}
              form={form}
              handleSubmit={handleSubmit}
            />
          </TabsContent>
          <TabsContent value="ru">
            <CommonFormCreateForm
              locale={"ru"}
              form={form}
              handleSubmit={handleSubmit}
            />
          </TabsContent>
          <TabsContent value="en">
            <CommonFormCreateForm
              locale={"en"}
              form={form}
              handleSubmit={handleSubmit}
            />
          </TabsContent>
        </Tabs>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="my-4 grid grid-cols-1 justify-end gap-4 mb-8 items-start"
          >
            <MultiSelect
              title={t("dashboard.adminExams.groups")}
              data={dataGroupsOptions}
              control={form.control}
              name="groups"
            />
            <MultiSelect
              title={t("dashboard.adminExams.lessons")}
              data={dataLessonsOptions}
              control={form.control}
              name="lessons"
            />
            <MultiSelect
              title={t("dashboard.adminExams.users")}
              data={dataUsersOptions}
              control={form.control}
              name="responsible"
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-0.5">
                    <FormLabel>{t("dashboard.adminExams.isActive")}</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <AdminExamsImage
          form={form}
          setSelectedFile={setSelectedFile}
          isPending={createExamsMutation.isPending}
          selectedFile={selectedFile}
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <AdminExamsQuestions form={form} />
          </form>
        </Form>
        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            className="w-auto"
            onClick={() => form.handleSubmit(handleSubmit)()}
          >
            {createExamsMutation.isPending ? (
              <>
                <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-current rounded-full inline-block align-middle" />
                {t("dashboard.adminExams.Uploading")}
              </>
            ) : (
              t("dashboard.adminExams.createExam")
            )}
          </Button>
        </div>
      </div>
    </ContentLayout>
  );
}
