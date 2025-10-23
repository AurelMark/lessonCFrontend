"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import {
  deleteNewsById,
  editNewsById,
  getNewsBySlug,
} from "@/api/news";
import { Button } from "@/componentsUI/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/componentsUI/tabs";

import { CreateNews, CreateNewsSchema, NewsEvent } from "@/validation/news";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { AdminNewsTags } from "@/components/Admin/News/AdminNewsTags";
import { AdminNewsImage } from "@/components/Admin/News/AdminNewsImage";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import slugify from "slugify";
import { SERVER_URL } from "@/constants";
import { LANG_TYPE } from "@/types";
import { cn } from "@/lib/utils";
import { deleteFolder, uploadImage } from "@/api/uploads";
import { CommonFormCreateForm } from "@/custom/CommonFormCreate";
import { ContentLoader } from "@/components/DashboardPanel/ContentLoader";

type UploadNewsImageArgs = { file: File; slug: string };

export default function AdminNewsEditPageBySlug() {
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;
  const { slug } = useParams() as { slug: string };
  const queryClient = useQueryClient();

  const form = useForm<CreateNews>({
    resolver: zodResolver(CreateNewsSchema),
    defaultValues: {
      title: { ro: "", en: "", ru: "" },
      description: { ro: "", en: "", ru: "" },
      tags: [],
      content: { ro: "", en: "", ru: "" },
      imageUrl: "",
      slug: "",
      id: "",
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
    queryKey: ["newsBySlugAndId", slug],
    queryFn: () => getNewsBySlug(slug),
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
        tags: data.tags || [],
        imageUrl: data.imageUrl || "",
        slug: data.slug || "",
        id: data.id || "",
      });
      setSelectedFile(null);
    }
  }, [data, isLoading, form]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutation = useMutation<any, Error, UploadNewsImageArgs>({
    mutationFn: ({ file, slug }) => uploadImage(file, slug),
    onMutate: () => {
      toast.loading(t("dashboard.adminNews.Uploading"), { id: "image-upload" });
    },
    onSuccess: (data) => {
      if (data.success && data.files && data.files.length > 0) {
        const filePath = data.files[0].path.replace(/\\/g, "/");
        const imageUrl = SERVER_URL + filePath;
        form.setValue("imageUrl", imageUrl);
      }
      toast.dismiss("image-upload");
      toast.success(t("dashboard.adminNews.UploadSuccess"));
    },
    onError: () => {
      toast.dismiss("image-upload");
      toast.error(t("dashboard.adminNews.UploadError"));
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editNewsMutation = useMutation<any, Error, NewsEvent>({
    mutationFn: editNewsById,
    onSuccess: () => {
      toast.success(t("dashboard.adminNews.NewsUpdatedSuccess"));
      window.location.href = `/${locale}/dashboard/news`;
    },
    onError: () => {
      toast.error(t("dashboard.adminNews.NewsUpdatedFailed"));
    },
  });

  const handleSubmit = async (data: NewsEvent) => {
    const currentSlug = form.watch("title.ro");
    const generatedSlug = slugify(currentSlug, {
      lower: true,
      strict: true,
      locale: "ro",
    });
    form.setValue("slug", generatedSlug);

    let imageUrl = form.getValues("imageUrl") || "";

    if (selectedFile) {
      await new Promise<void>((resolve, reject) => {
        mutation.mutate(
          { file: selectedFile, slug: generatedSlug || "" },
          {
            onSuccess: (uploadRes) => {
              if (uploadRes.success && uploadRes.files.length > 0) {
                const filePath = uploadRes.files[0].path.replace(/\\/g, "/");
                imageUrl =
                  SERVER_URL.replace(/\/$/, "") +
                  "/" +
                  filePath.replace(/^\/+/, "");
                form.setValue("imageUrl", imageUrl);
                resolve();
              } else {
                toast.error(t("dashboard.adminNews.UploadError"));
                reject();
              }
            },
            onError: () => {
              toast.error(t("dashboard.adminNews.UploadError"));
              reject();
            },
          }
        );
      });
    } else if (!imageUrl) {
      toast.error(t("dashboard.adminNews.UploadNewsImage"));
      return;
    }

    editNewsMutation.mutate({
      ...data,
      slug: generatedSlug,
      imageUrl,
    });
  };

  const deleteMutation = useMutation({
    mutationFn: deleteNewsById,
    onSuccess: () => {
      toast.success(
        <>
          <div className="font-bold">{t("dashboard.newsDeletedSuccess")}</div>
        </>
      );
      queryClient.invalidateQueries({ queryKey: ["news"] });
      window.location.href = `/${locale}/dashboard/news`;
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: ({
      scope,
      category,
      folder,
    }: {
      scope: string;
      category: string;
      folder: string;
    }) => deleteFolder(scope, category, folder),
    onSuccess: () => {
      toast.success(
        <>
          <div className="font-bold">{t("dashboard.newsDeletedSuccess")}</div>
        </>
      );
    },
  });

  const handleDeleteNews = () => {
    const formId = form.getValues("id");
    if (formId) deleteMutation.mutate(formId);
    deleteFolderMutation.mutate({
      scope: "public",
      category: "blog",
      folder: slug,
    });
  };

  if (isLoading)
    return (
      <ContentLayout title="News" key={slug}>
        <ContentLoader />
      </ContentLayout>
    );
  if (error)
    return (
      <ContentLayout title="News" key={slug}>
        <div>{t("loadError")}</div>
      </ContentLayout>
    );

  return (
    <ContentLayout title="News" key={slug}>
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
        <AdminNewsTags form={form} />
        <AdminNewsImage
          form={form}
          setSelectedFile={setSelectedFile}
          isPending={editNewsMutation.isPending}
          selectedFile={selectedFile}
        />
        <div className="mt-8 flex flex-col items-center sm:flex-row  justify-center gap-4">
          <Button
            type="button"
            className="w-auto"
            variant="destructive"
            onClick={handleDeleteNews}
          >
            {t("dashboard.deleteNews")}
          </Button>
          <Button
            type="button"
            className="w-auto"
            onClick={() =>
              form.handleSubmit(handleSubmit, (error) =>
                console.log("error", error)
              )()
            }
          >
            {t("dashboard.adminNews.EditNews")}
          </Button>
        </div>
      </div>
    </ContentLayout>
  );
}
