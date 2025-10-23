"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { createNewsById } from "@/api/news";
import { Button } from "@/componentsUI/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/componentsUI/tabs";

import { CreateNews, CreateNewsSchema, NewsEvent } from "@/validation/news";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { AdminNewsTags } from "@/components/Admin/News/AdminNewsTags";
import { AdminNewsImage } from "@/components/Admin/News/AdminNewsImage";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { SERVER_URL } from "@/constants";
import { LANG_TYPE } from "@/types";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/api/uploads";
import { CommonFormCreateForm } from "@/custom/CommonFormCreate";

type UploadNewsImageArgs = { file: File; slug: string };

export default function AdminNewsCreatePage() {
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;

  const form = useForm<CreateNews>({
    resolver: zodResolver(CreateNewsSchema),
    defaultValues: {
      title: { ro: "", en: "", ru: "" },
      description: { ro: "", en: "", ru: "" },
      tags: [],
      content: { ro: "", en: "", ru: "" },
      imageUrl: "",
      slug: "",
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
  const createNewsMutation = useMutation<any, Error, NewsEvent>({
    mutationFn: (data) => createNewsById(data),
    onSuccess: () => {
      toast.success(t("dashboard.adminNews.NewsCreatedSuccess"));
      router.push(`/${locale}/dashboard/news`);
    },
    onError: () => {
      toast.error(t("dashboard.adminNews.NewsCreateFailed"));
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
    if (!selectedFile) {
      toast.error(t("dashboard.adminNews.UploadNewsImage"));
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

    createNewsMutation.mutate({
      ...data,
      slug: generatedSlug,
      imageUrl: form.getValues("imageUrl") || "",
    });
  };

  return (
    <ContentLayout title="News">
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
          isPending={createNewsMutation.isPending}
          selectedFile={selectedFile}
        />
        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            className="w-auto"
            onClick={() => form.handleSubmit(handleSubmit)()}
          >
            {t("dashboard.createNews")}
          </Button>
        </div>
      </div>
    </ContentLayout>
  );
}
