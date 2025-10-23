"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { Button } from "@/componentsUI/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/componentsUI/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueries } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LANG_TYPE } from "@/types";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/componentsUI/form";

import { Input } from "@/componentsUI/input";
import { GroupsForm, GroupsFormSchema } from "@/validation/groups";
import { createGroups } from "@/api/groups";
import {
  getDictionaryExams,
  getDictionaryLessons,
  getDictionaryUsers,
} from "@/api/dictionary";
import { MultiSelect } from "@/custom/MultiSelect";
import { useUserStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export default function AdminGroupsCreatePage() {
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;
  const userState = useUserStore((state) => state.user);

  const form = useForm<GroupsForm>({
    resolver: zodResolver(GroupsFormSchema),
    defaultValues: {
      title: { ro: "", en: "", ru: "" },
      createdBy: "",
      exams: [],
      lessons: [],
      responsible: [],
      users: [],
    },
  });

  const [dataLessons, dataUsers, dataExams] = useQueries({
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
        queryKey: ["dic-exams"],
        queryFn: getDictionaryExams,
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

  const dataExamsOptions = dataExams.data
    ? dataExams.data.map((exams) => ({
        label: exams.title[locale],
        value: exams.id,
      }))
    : [];

  const router = useRouter();
  const errors = form.formState.errors;
  const errorRo = !!errors?.title?.ro;
  const errorRu = !!errors?.title?.ru;
  const errorEn = !!errors?.title?.en;

  useEffect(() => {
    if (userState?.id) {
      form.setValue("createdBy", userState.id);
    }
  }, [userState, form]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createCourseMutation = useMutation<any, Error, GroupsForm>({
    mutationFn: (data) => createGroups(data),
    onSuccess: () => {
      toast.success(t("dashboard.adminGroups.groupCreatedSuccess"));
      router.push(`/${locale}/dashboard/groups`);
    },
    onError: () => {
      toast.error(t("dashboard.adminGroups.groupCreateError"));
    },
  });

  const handleSubmit = async (data: GroupsForm) => {
    createCourseMutation.mutate({
      ...data,
    });
  };

  return (
    <ContentLayout title="Groups">
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4 my-4"
              >
                <FormField
                  control={form.control}
                  name={`title.ro`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("dashboard.adminGroups.title")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="ru">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4 my-4"
              >
                <FormField
                  control={form.control}
                  name={`title.ru`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("dashboard.adminGroups.title")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="en">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4 my-4"
              >
                <FormField
                  control={form.control}
                  name={`title.en`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("dashboard.adminGroups.title")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </TabsContent>
        </Tabs>
        <Form {...form}>
          <form className="flex flex-col gap-4">
            <MultiSelect
              title={t("dashboard.adminGroups.lessons")}
              data={dataLessonsOptions}
              control={form.control}
              name="lessons"
            />
            <MultiSelect
              title={t("dashboard.adminGroups.users")}
              data={dataUsersOptions}
              control={form.control}
              name="users"
            />
            <MultiSelect
              title={t("dashboard.adminGroups.responsible")}
              data={dataUsersOptions}
              control={form.control}
              name="responsible"
            />
            <MultiSelect
              title={t("dashboard.adminGroups.exams")}
              data={dataExamsOptions}
              control={form.control}
              name="exams"
            />
          </form>
        </Form>
        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            className="w-auto"
            onClick={() => form.handleSubmit(handleSubmit)()}
          >
            {createCourseMutation.isPending ? (
              <>
                <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-current rounded-full inline-block align-middle" />
                {t("dashboard.adminGroups.loading")}
              </>
            ) : (
              t("dashboard.adminGroups.createGroup")
            )}
          </Button>
        </div>
      </div>
    </ContentLayout>
  );
}
