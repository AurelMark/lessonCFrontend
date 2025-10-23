"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { Button } from "@/componentsUI/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/componentsUI/tabs";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { SERVER_URL } from "@/constants";
import { LANG_TYPE } from "@/types";
import { cn } from "@/lib/utils";
import { uploadPrivateFiles, uploadPrivateImage } from "@/api/uploads";
import { LessonForm, LessonFormSchema } from "@/validation/lesson";
import { useUserStore } from "@/store/useAuthStore";
import { AdminLessonImage } from "@/components/Admin/Lesson/AdminLessonImage";
import { AdminLessonMaterials } from "@/components/Admin/Lesson/AdminLessonMaterials";
import { Switch } from "@/componentsUI/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/componentsUI/form";
import { createLesson } from "@/api/lesson";
import { MultiSelect } from "@/custom/MultiSelect";
import { CommonFormCreateForm } from "@/custom/CommonFormCreate";
import { getDictionaryExams, getDictionaryGroups } from "@/api/dictionary";

type UploadLessonImageArgs = { file: File; slug: string };
type Material = {
  name: string;
  type: string;
  url: string;
  order: number;
  file?: File;
};

export default function AdminLessonCreatePage() {
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;
  const { data: dataGroups } = useQuery({
    queryKey: ["dic-groups"],
    queryFn: () => getDictionaryGroups(),
    staleTime: 0,
    gcTime: 0,
  });

  const { data: dataExams } = useQuery({
    queryKey: ["dic-exams"],
    queryFn: () => getDictionaryExams(),
    staleTime: 0,
    gcTime: 0,
  });

  const dataGroupsOptions = dataGroups
    ? dataGroups.map((group) => ({
        label: group.title[locale],
        value: group.id,
      }))
    : [];

  const dataExamsOptions = dataExams
    ? dataExams.map((exam) => ({
        label: exam.title[locale],
        value: exam.id,
      }))
    : [];

  const useUserStoreState = useUserStore((state) => state.user);
  const form = useForm<LessonForm>({
    resolver: zodResolver(LessonFormSchema),
    defaultValues: {
      title: { ro: "", en: "", ru: "" },
      description: { ro: "", en: "", ru: "" },
      content: { ro: "", en: "", ru: "" },
      imageUrl: "",
      slug: "",
      createdBy: "",
      groups: [],
      isActive: true,
      materials: [],
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
  const mutation = useMutation<any, Error, UploadLessonImageArgs>({
    mutationFn: ({ file, slug }) => uploadPrivateImage(file, slug, "lesson"),
    onMutate: () => {
      toast.loading(t("dashboard.adminLesson.Uploading"), {
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
      toast.success(t("dashboard.adminLesson.UploadSuccess"));
    },
    onError: () => {
      toast.dismiss("image-upload");
      toast.error(t("dashboard.adminLesson.UploadError"));
    },
  });

  const multipleFilemutation = useMutation<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    Error,
    { files: File[]; slug: string }
  >({
    mutationFn: ({ files, slug }) => uploadPrivateFiles(files, slug, "lesson"),
    onMutate: () => {
      toast.loading(t("dashboard.adminLesson.Uploading"), {
        id: "file-upload",
      });
    },
    onSuccess: (data) => {
      if (data.success && Array.isArray(data.files)) {
        const fileUrls = data.files.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (file: any) =>
            SERVER_URL.replace(/\/$/, "") +
            "/" +
            file.path
              .replace(/\\/g, "/")
              .replace(/\/\.\.\//g, "/")
              .replace(/^\/+/, "")
        );
        form.setValue("materials", fileUrls);
      }
      toast.dismiss("file-upload");
      toast.success(t("dashboard.adminLesson.UploadSuccess"));
    },
    onError: () => {
      toast.dismiss("file-upload");
      toast.error(t("dashboard.adminLesson.UploadError"));
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createLessonMutation = useMutation<any, Error, LessonForm>({
    mutationFn: (data) => createLesson(data),
    onSuccess: () => {
      toast.success(t("dashboard.adminLesson.LessonCreatedSuccess"));
      router.push(`/${locale}/dashboard/lesson`);
    },
    onError: () => {
      toast.error(t("dashboard.adminLesson.LessonCreateFailed"));
    },
  });

  const handleSubmit = async (data: LessonForm) => {
    const currentSlug = form.watch("title.ro");
    const generatedSlug = slugify(currentSlug, {
      lower: true,
      strict: true,
      locale: "ro",
    });
    form.setValue("slug", generatedSlug);

    if (!selectedFile) {
      toast.error(t("dashboard.adminLesson.UploadLessonImage"));
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
              toast.error(t("dashboard.adminLesson.UploadError"));
              reject();
            }
          },
          onError: () => {
            toast.error(t("dashboard.adminLesson.UploadError"));
            reject();
          },
        }
      );
    });
    await new Promise<void>((resolve, reject) => {
      const materials = form.getValues("materials") as Material[];
      const filesToUpload = materials
        .map((mat) => mat.file)
        .filter(Boolean) as File[];

      if (!filesToUpload.length) {
        resolve();
        return;
      }
      multipleFilemutation.mutate(
        { files: filesToUpload, slug: generatedSlug || "" },
        {
          onSuccess: (uploadRes) => {
            const materialPaths = uploadRes.files.map(
              ({ path }: { path: string }) => {
                const changedPath =
                  SERVER_URL.replace(/\/$/, "") +
                  "/" +
                  path.replace(/^\/+/, "");
                return changedPath;
              }
            );
            const newMaterials = materials.map((el, idx) => ({
              ...el,
              url: materialPaths[idx],
            }));
            if (uploadRes.success && Array.isArray(uploadRes.files)) {
              form.setValue("materials", newMaterials);
              resolve();
            } else {
              toast.error(t("dashboard.adminLesson.UploadError"));
              reject();
            }
          },
          onError: () => {
            toast.error(t("dashboard.adminLesson.UploadError"));
            reject();
          },
        }
      );
    });

    createLessonMutation.mutate({
      ...data,
      slug: generatedSlug,
      imageUrl: form.getValues("imageUrl") || "",
      materials: form.getValues("materials") || [],
    });
  };

  return (
    <ContentLayout title="Lesson">
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
        <AdminLessonMaterials form={form} />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="my-4 grid grid-cols-1 justify-end sm:grid-cols-[0.5fr_0.5fr_100px] gap-4"
          >
            <MultiSelect
              title={t("dashboard.adminLesson.groups")}
              data={dataGroupsOptions}
              control={form.control}
              name="groups"
            />
            <MultiSelect
              title={t("dashboard.adminLesson.examen")}
              data={dataExamsOptions}
              control={form.control}
              name="examen"
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-0.5">
                    <FormLabel>{t("dashboard.adminLesson.isActive")}</FormLabel>
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
        <AdminLessonImage
          form={form}
          setSelectedFile={setSelectedFile}
          isPending={createLessonMutation.isPending}
          selectedFile={selectedFile}
        />
        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            className="w-auto"
            onClick={() => form.handleSubmit(handleSubmit)()}
          >
            {createLessonMutation.isPending ? (
              <>
                <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-current rounded-full inline-block align-middle" />
                {t("dashboard.adminLesson.Uploading")}
              </>
            ) : (
              t("dashboard.adminLesson.createLesson")
            )}
          </Button>
        </div>
      </div>
    </ContentLayout>
  );
}
