"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { generateUsers } from "@/api/users";
import { Button } from "@/componentsUI/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/componentsUI/form";
import { Input } from "@/componentsUI/input";
import { UserGenerate, UserGenerateSchema } from "@/validation/users";
import { LANG_TYPE } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getDictionaryGroups } from "@/api/dictionary";
import { MultiSelect } from "@/custom/MultiSelect";

export default function AdminUserPage() {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const locale = useLocale() as LANG_TYPE;

  const router = useRouter();
  const form = useForm<UserGenerate>({
    resolver: zodResolver(UserGenerateSchema),
    defaultValues: {
      baseEmail: "",
      baseLogin: "",
      count: "",
      groups: [],
    },
  });

  const { data: dataGroups } = useQuery({
    queryKey: ["dic-groups"],
    queryFn: () => getDictionaryGroups(),
    staleTime: 0,
    gcTime: 0,
  });

  const { mutate: generateMutation, isPending } = useMutation({
    mutationFn: generateUsers,
    onSuccess: () => {
      toast.success(
        <>
          <div className="font-bold">
            {t("dashboard.adminUsers.usersGeneratedSuccess")}
          </div>
        </>
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const dataGroupsOptions = dataGroups
    ? dataGroups.map((group) => ({
        label: group.title[locale],
        value: group.id,
      }))
    : [];

  const handleSubmit = (data: UserGenerate) => {
    generateMutation(data);
  };

  const handleRedirectToList = () => router.push(`/${locale}/dashboard/users`);

  return (
    <ContentLayout title="Users">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8 my-4 bg-background py-8 px-4 rounded-lg"
        >
          <FormField
            control={form.control}
            name={"count"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dashboard.adminUsers.count")}</FormLabel>
                <FormControl>
                  <Input disabled={isPending} type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"baseEmail"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dashboard.adminUsers.email")}</FormLabel>
                <FormControl>
                  <Input disabled={isPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"baseLogin"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dashboard.adminUsers.login")}</FormLabel>
                <FormControl>
                  <Input disabled={isPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <MultiSelect
            title={t("dashboard.adminLesson.groups")}
            data={dataGroupsOptions}
            control={form.control}
            name="groups"
          />
          <div className="flex flex-col justify-center gap-4 md:flex-row">
            <Button
              variant="secondary"
              type="button"
              onClick={handleRedirectToList}
            >
              {t("dashboard.adminUsers.backToUsersList")}
            </Button>
            <Button disabled={isPending}>
              {isPending ? (
                <>
                  <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-current rounded-full inline-block align-middle" />
                  {t("dashboard.adminUsers.usersGeneratingLoading")}
                </>
              ) : (
                t("dashboard.adminUsers.generateUsers")
              )}
            </Button>
          </div>
        </form>
      </Form>
    </ContentLayout>
  );
}
