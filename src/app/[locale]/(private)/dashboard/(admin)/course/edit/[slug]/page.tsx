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
import {
  DURATION_UNIT,
  LANGUAGES_TYPE,
  LEVEL_SKILLS,
  SERVER_URL,
} from "@/constants";
import { LANG_TYPE } from "@/types";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/api/uploads";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/componentsUI/form";
import { CommonFormCreateForm } from "@/custom/CommonFormCreate";
import { CourseForm, CourseFormSchema } from "@/validation/course";
import { AdminCourseImage } from "@/components/Admin/Course/AdminCourseImage";
import { Input } from "@/componentsUI/input";
import { Switch } from "@/componentsUI/switch";

import { buildOptions } from "@/lib/buildOptions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/componentsUI/select";
import { editCourse, getCourseBySlug } from "@/api/course";
import { AdminCourseAlert } from "@/components/Admin/Course/AdminCourseAlert";

type UploadCourseImageArgs = { file: File; slug: string };

export default function AdminCourseEditePage() {
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;
  const { slug } = useParams() as { slug: string };

  const form = useForm<CourseForm>({
    resolver: zodResolver(CourseFormSchema),
    defaultValues: {
      id: "",
      title: { ro: "", en: "", ru: "" },
      description: { ro: "", en: "", ru: "" },
      content: { ro: "", en: "", ru: "" },
      imageUrl: "",
      slug: "",
      alert: [],
      features: {
        asssessments: false,
        duration: "",
        durationType: "",
        language: "",
        lectures: "",
        quizzes: "",
        skillLevel: "",
        students: "",
      },
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const errors = form.formState.errors;
  const errorRo =
    !!errors?.title?.ro || !!errors?.description?.ro || !!errors?.content?.ro;

  const errorRu =
    !!errors?.title?.ru || !!errors?.description?.ru || !!errors?.content?.ru;

  const errorEn =
    !!errors?.title?.en || !!errors?.description?.en || !!errors?.content?.en;

  const { data, isLoading } = useQuery({
    queryKey: ["courseBySlug", slug],
    queryFn: () => getCourseBySlug(slug),
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (data && !isLoading) {
      form.reset({
        title: {
          ro: data.course.title?.ro ?? "",
          en: data.course.title?.en ?? "",
          ru: data.course.title?.ru ?? "",
        },
        description: {
          ro: data.course.description?.ro ?? "",
          en: data.course.description?.en ?? "",
          ru: data.course.description?.ru ?? "",
        },
        content: {
          ro: data.course.content?.ro ?? "",
          en: data.course.content?.en ?? "",
          ru: data.course.content?.ru ?? "",
        },
        imageUrl: data.course.imageUrl || "",
        slug: data.course.slug || "",
        id: data.course.id || "",
        features: {
          duration: String(data.course.features.duration),
          asssessments: data.course.features.asssessments,
          durationType: data.course.features.durationType,
          language: data.course.features.language,
          lectures: String(data.course.features.lectures),
          quizzes: String(data.course.features.quizzes),
          skillLevel: data.course.features.skillLevel,
          students: String(data.course.features.students),
        },
        alert: data.course.alert,
      });
      setSelectedFile(null);
    }
  }, [data, isLoading, form]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutation = useMutation<any, Error, UploadCourseImageArgs>({
    mutationFn: ({ file, slug }) => uploadImage(file, slug, "course"),
    onMutate: () => {
      toast.loading(t("dashboard.adminCourse.Uploading"), {
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
      toast.success(t("dashboard.adminCourse.UploadSuccess"));
    },
    onError: () => {
      toast.dismiss("image-upload");
      toast.error(t("dashboard.adminCourse.UploadError"));
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editCourseMutation = useMutation<any, Error, CourseForm>({
    mutationFn: (data) => editCourse(data, data.id!),
    onSuccess: () => {
      toast.success(t("dashboard.adminCourse.CourseCreatedSuccess"));
      queryClient.invalidateQueries({ queryKey: ["course"] });
      window.location.href = `/${locale}/dashboard/course`;
    },
    onError: () => {
      toast.error(t("dashboard.adminCourse.CourseCreateFailed"));
    },
  });

  const handleSubmit = async (data: CourseForm) => {
    const currentSlug = form.watch("title.ro");
    const generatedSlug = slugify(currentSlug, {
      lower: true,
      strict: true,
      locale: "ro",
    });
    form.setValue("slug", generatedSlug);

    if (!selectedFile && !form.getValues("imageUrl")) {
      toast.error(t("dashboard.adminCourse.UploadCourseImage"));
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
                toast.error(t("dashboard.adminCourse.UploadError"));
                reject();
              }
            },
            onError: () => {
              toast.error(t("dashboard.adminCourse.UploadError"));
              reject();
            },
          }
        );
      });
    }

    editCourseMutation.mutate({
      ...data,
      slug: generatedSlug,
      imageUrl: form.getValues("imageUrl") || "",
    });
  };

  return (
    <ContentLayout title="Course">
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
            className="my-4 grid grid-cols-1 justify-end sm:grid-cols-[1fr_1fr_1fr] gap-4"
          >
            <FormField
              control={form.control}
              name="features.durationType"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    {t("dashboard.adminCourse.selectDuration")}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t(
                            "dashboard.adminCourse.selectDuration"
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {buildOptions(DURATION_UNIT["durationUnit"], locale).map(
                        (opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"features.duration"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.adminCourse.duration")}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="features.language"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("dashboard.adminCourse.language")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t(
                            "dashboard.adminCourse.selectLanguage"
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {buildOptions(LANGUAGES_TYPE["language"], locale).map(
                        (opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"features.lectures"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.adminCourse.lectures")}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"features.quizzes"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.adminCourse.quizzes")}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="features.skillLevel"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("dashboard.adminCourse.level")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("dashboard.adminCourse.selectLevel")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {buildOptions(LEVEL_SKILLS["level"], locale).map(
                        (opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"features.students"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.adminCourse.students")}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="features.asssessments"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-0.5">
                    <FormLabel>
                      {t("dashboard.adminCourse.assessments")}
                    </FormLabel>
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="my-4 grid grid-cols-1"
          >
            <AdminCourseAlert form={form} />
          </form>
        </Form>
        <AdminCourseImage
          form={form}
          setSelectedFile={setSelectedFile}
          isPending={editCourseMutation.isPending}
          selectedFile={selectedFile}
        />
        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            className="w-auto"
            onClick={() => form.handleSubmit(handleSubmit)()}
          >
            {editCourseMutation.isPending ? (
              <>
                <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-current rounded-full inline-block align-middle" />
                {t("dashboard.adminCourse.Uploading")}
              </>
            ) : (
              t("dashboard.adminCourse.editCourse")
            )}
          </Button>
        </div>
      </div>
    </ContentLayout>
  );
}
