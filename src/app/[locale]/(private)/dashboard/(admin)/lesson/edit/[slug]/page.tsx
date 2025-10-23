"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { Button } from "@/componentsUI/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/componentsUI/tabs";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
import { editLesson, getLessonBySlug } from "@/api/lesson";
import { MultiSelect } from "@/custom/MultiSelect";
import { CommonFormCreateForm } from "@/custom/CommonFormCreate";
import { getDictionaryExams, getDictionaryGroups } from "@/api/dictionary";
import { ContentLoader } from "@/components/DashboardPanel/ContentLoader";

type UploadLessonImageArgs = { file: File; slug: string };
type Material = {
  name: string;
  type: string;
  url: string;
  order: number;
  file?: File;
};
type TGroupsData = {
  title: {
    ro: string;
    ru: string;
    en: string;
  };
  id?: string;
};

export default function AdminLessonEditPage() {
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;
  const { slug } = useParams() as { slug: string };
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
  const queryClient = useQueryClient();

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
  const errors = form.formState.errors;
  const errorRo =
    !!errors?.title?.ro || !!errors?.description?.ro || !!errors?.content?.ro;

  const errorRu =
    !!errors?.title?.ru || !!errors?.description?.ru || !!errors?.content?.ru;

  const errorEn =
    !!errors?.title?.en || !!errors?.description?.en || !!errors?.content?.en;

  const { data, isLoading, error } = useQuery({
    queryKey: ["lessonBySlug", slug],
    queryFn: () => getLessonBySlug(slug),
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (data && !isLoading) {
      form.reset({
        title: {
          ro: data.title?.ro ?? "",
          en: data.title?.en ?? "",
          ru: data.title?.ru ?? "",
        },
        description: {
          ro: data.description?.ro ?? "",
          en: data.description?.en ?? "",
          ru: data.description?.ru ?? "",
        },
        content: {
          ro: data.content?.ro ?? "",
          en: data.content?.en ?? "",
          ru: data.content?.ru ?? "",
        },
        imageUrl: data.imageUrl || "",
        slug: data.slug || "",
        id: data.id || "",
        groups: (data.groups || []).map((el: TGroupsData | string) =>
          typeof el === "string" ? el : el.id
        ),
        isActive: data.isActive || false,
        materials:
          data.materials?.map((m, i) => ({
            ...m,
            id: `${m.name}-${i}-${Date.now()}`,
          })) || [],
        examen: data.examen?.map((e) => e.id).filter(Boolean) || [],
        createdBy: data.createdBy?.id,
      });
      setSelectedFile(null);
    }
  }, [data, isLoading, form, useUserStoreState]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutation = useMutation<any, Error, UploadLessonImageArgs>({
    mutationFn: ({ file, slug }) => uploadPrivateImage(file, slug, "lesson"),
    onMutate: () => {
      toast.loading(t("dashboard.adminLesson.Uploading"), {
        id: "image-upload",
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
        const materials = form.getValues("materials") as Material[];
        let urlIndex = 0;
        const updatedMaterials = materials.map((mat) => {
          if (mat.url.startsWith("blob:") && urlIndex < fileUrls.length) {
            const updated = { ...mat, url: fileUrls[urlIndex] };
            delete updated.file;
            urlIndex++;
            return updated;
          }
          return mat;
        });
        form.setValue("materials", updatedMaterials);
      }
      toast.dismiss("file-upload");
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

        const materials = form.getValues("materials") as Material[];
        let urlIndex = 0;

        const updatedMaterials = materials.map((mat) => {
          if (mat.url.startsWith("blob:") && urlIndex < fileUrls.length) {
            const updated = { ...mat, url: fileUrls[urlIndex] };
            delete updated.file;
            urlIndex++;
            return updated;
          }
          return mat;
        });
        form.setValue("materials", updatedMaterials);
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
  const editLessonMutation = useMutation<any, Error, LessonForm>({
    mutationFn: (data) => editLesson(data, data.id!),
    onSuccess: () => {
      toast.success(t("dashboard.adminLesson.LessonEditedSuccess"));
      queryClient.invalidateQueries({ queryKey: ["lesson"] });
      window.location.href = `/${locale}/dashboard/lesson`;
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

    if (selectedFile) {
      await new Promise<void>((resolve, reject) => {
        mutation.mutate(
          { file: selectedFile, slug: generatedSlug || "" },
          {
            onSuccess: (uploadRes) => {
              if (uploadRes.success && Array.isArray(uploadRes.files)) {
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
    }
    let updatedMaterials = form.getValues("materials") as Material[];
    const blobMaterials = updatedMaterials.filter(
      (mat) => mat.url.startsWith("blob:") && mat.file
    );

    if (blobMaterials.length > 0) {
      const filesToUpload = blobMaterials.map((mat) => mat.file as File);

      await new Promise<void>((resolve, reject) => {
        multipleFilemutation.mutate(
          { files: filesToUpload, slug: generatedSlug || "" },
          {
            onSuccess: (uploadRes) => {
              if (uploadRes.success && Array.isArray(uploadRes.files)) {
                const fileUrls = uploadRes.files.map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (file: any) =>
                    SERVER_URL.replace(/\/$/, "") +
                    "/" +
                    file.path
                      .replace(/\\/g, "/")
                      .replace(/\/\.\.\//g, "/")
                      .replace(/^\/+/, "")
                );
                let urlIndex = 0;
                updatedMaterials = updatedMaterials.map((mat) => {
                  if (
                    mat.url.startsWith("blob:") &&
                    urlIndex < fileUrls.length
                  ) {
                    const updated = { ...mat, url: fileUrls[urlIndex] };
                    delete updated.file;
                    urlIndex++;
                    return updated;
                  }
                  return mat;
                });
                form.setValue("materials", updatedMaterials);
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
    }

    const finalMaterials = form.getValues("materials") as Material[];
    const hasBlob = finalMaterials.some((mat) => mat.url.startsWith("blob:"));
    if (hasBlob) {
      toast.error("dashboard.adminLesson.uploadNotAllSuccess");
      return;
    }

    editLessonMutation.mutate({
      ...data,
      slug: generatedSlug,
      groups: form.getValues("groups"),
      imageUrl: form.getValues("imageUrl") || "",
      materials: finalMaterials,
    });
  };

  if (isLoading)
    return (
      <ContentLayout title="Lesson" key={slug}>
        <ContentLoader />
      </ContentLayout>
    );
  if (error)
    return (
      <ContentLayout title="Lesson" key={slug}>
        <div>{t("loadError")}</div>
      </ContentLayout>
    );

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
          isPending={editLessonMutation.isPending}
          selectedFile={selectedFile}
        />
        <div className="mt-8 flex justify-center gap-4">
          <Button
            type="button"
            className="w-auto"
            onClick={() => form.handleSubmit(handleSubmit)()}
          >
            {editLessonMutation.isPending ? (
              <>
                <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-current rounded-full inline-block align-middle" />
                {t("dashboard.adminLesson.Uploading")}
              </>
            ) : (
              t("dashboard.adminLesson.editLesson")
            )}
          </Button>
        </div>
      </div>
    </ContentLayout>
  );
}
