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
import { useParams, useRouter } from "next/navigation";
import slugify from "slugify";
import { SERVER_URL } from "@/constants";
import { LANG_TYPE } from "@/types";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/api/uploads";
import {
  SubcourseForm,
  SubcourseFormSchema,
} from "@/validation/course";
import { editSubcourse, getSubcourseById } from "@/api/course";
import { SubcourseFormCreateForm } from "@/components/Admin/Course/AdminSubCourseForm";
import { AdminSubcourseImage } from "@/components/Admin/Course/AdminSubcourseImage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/componentsUI/form";
import { Input } from "@/componentsUI/input";

type UploadCourseImageArgs = { file: File; slug: string };

export default function AdminSubCourseCreatePage() {
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;
  const { slug, subId } = useParams() as { slug: string; subId: string };

  const form = useForm<SubcourseForm>({
    resolver: zodResolver(SubcourseFormSchema),
    defaultValues: {
      title: { ro: "", en: "", ru: "" },
      description: { ro: "", en: "", ru: "" },
      imageUrl: "",
      courseSlug: "",
      price: "",
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const errors = form.formState.errors;
  const errorRo = !!errors?.title?.ro || !!errors?.description?.ro;

  const errorRu = !!errors?.title?.ru || !!errors?.description?.ru;

  const errorEn = !!errors?.title?.en || !!errors?.description?.en;

  const { data, isLoading } = useQuery({
    queryKey: ["subcourseById", slug],
    queryFn: () => getSubcourseById(slug, subId),
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
        imageUrl: data.imageUrl || "",
        price: data.price.toString() || "",
        id: data.id || "",
      });
      setSelectedFile(null);
    }
  }, [data, isLoading, form]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutation = useMutation<any, Error, UploadCourseImageArgs>({
    mutationFn: ({ file, slug }) => uploadImage(file, slug, "subcourse"),
    onMutate: () => {
      toast.loading(t("dashboard.adminSubcourse.Uploading"), {
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
      toast.success(t("dashboard.adminSubcourse.UploadSuccess"));
    },
    onError: () => {
      toast.dismiss("image-upload");
      toast.error(t("dashboard.adminSubcourse.UploadError"));
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editSubcourseMutation = useMutation<any, Error, SubcourseForm>({
    mutationFn: (data) => editSubcourse(data, slug, subId),
    onSuccess: () => {
      toast.success(t("dashboard.adminSubcourse.SubcourseCreatedSuccess"));
      router.push(`/${locale}/dashboard/course/${slug}/subcourse`);
    },
    onError: () => {
      toast.error(t("dashboard.adminSubcourse.SubcourseCreateFailed"));
    },
  });

  const handleSubmit = async (data: SubcourseForm) => {
    const currentSlug = form.watch("title.ro");
    const generatedSlug = slugify(currentSlug, {
      lower: true,
      strict: true,
      locale: "ro",
    });
    form.setValue("courseSlug", generatedSlug);

    if (!selectedFile && !form.getValues("imageUrl")) {
      toast.error(t("dashboard.adminSubcourse.UploadSubcourseImage"));
      return;
    }

    if (selectedFile) {
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
                toast.error(t("dashboard.adminSubcourse.UploadError"));
                reject();
              }
            },
            onError: () => {
              toast.error(t("dashboard.adminSubcourse.UploadError"));
              reject();
            },
          }
        );
      });
    }

    editSubcourseMutation.mutate({
      ...data,
      courseSlug: slug,
      imageUrl: form.getValues("imageUrl") || "",
    });
  };

  return (
    <ContentLayout title="Subcourse">
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
            <SubcourseFormCreateForm
              locale={"ro"}
              form={form}
              handleSubmit={handleSubmit}
            />
          </TabsContent>
          <TabsContent value="ru">
            <SubcourseFormCreateForm
              locale={"ru"}
              form={form}
              handleSubmit={handleSubmit}
            />
          </TabsContent>
          <TabsContent value="en">
            <SubcourseFormCreateForm
              locale={"en"}
              form={form}
              handleSubmit={handleSubmit}
            />
          </TabsContent>
        </Tabs>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mb-4 grid grid-cols-1 justify-end gap-4"
          >
            <FormField
              control={form.control}
              name={"price"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.adminSubcourse.price")}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <AdminSubcourseImage
          form={form}
          setSelectedFile={setSelectedFile}
          isPending={editSubcourseMutation.isPending}
          selectedFile={selectedFile}
        />
        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            className="w-auto"
            onClick={() => form.handleSubmit(handleSubmit)()}
          >
            {editSubcourseMutation.isPending ? (
              <>
                <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-current rounded-full inline-block align-middle" />
                {t("dashboard.adminSubcourse.Uploading")}
              </>
            ) : (
              t("dashboard.adminSubcourse.editSubcourse")
            )}
          </Button>
        </div>
      </div>
    </ContentLayout>
  );
}
