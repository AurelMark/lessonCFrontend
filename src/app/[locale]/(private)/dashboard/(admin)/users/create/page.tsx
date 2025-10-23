"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { Button } from "@/componentsUI/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROLES } from "@/constants";
import { LANG_TYPE } from "@/types";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/componentsUI/form";

import { Input } from "@/componentsUI/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/componentsUI/select";

import { UserForm, UserFormSchema } from "@/validation/users";
import { createUsers } from "@/api/users";
import { getDictionaryGroups } from "@/api/dictionary";
import { MultiSelect } from "@/custom/MultiSelect";

export default function AdminUsersCreatePage() {
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;

  const form = useForm<UserForm>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      login: "",
      password: "",
      role: "",
      groups: [],
    },
  });
  const router = useRouter();

  const { data: dataGroups } = useQuery({
    queryKey: ["dic-groups"],
    queryFn: () => getDictionaryGroups(),
    staleTime: 0,
    gcTime: 0,
  });

  const dataGroupsOptions = dataGroups
    ? dataGroups.map((group) => ({
        label: group.title[locale],
        value: group.id,
      }))
    : [];

  const { mutate: createUserMutation, isPending } = useMutation({
    mutationFn: createUsers,
    onSuccess: () => {
      toast.success(t("dashboard.adminUsers.userCreateSuccess"));
      router.push(`/${locale}/dashboard/users`);
    },
    onError: () => {
      toast.error(t("dashboard.adminUsers.userCreateError"));
    },
  });

  const handleSubmit = async (data: UserForm) => {
    createUserMutation(data);
  };

  return (
    <ContentLayout title="Users">
      <div className="mb-4 bg-background px-4 py-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="my-4 flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name={"email"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.adminUsers.email")}</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"login"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.adminUsers.login")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"password"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.adminUsers.password")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"firstName"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.adminUsers.firstName")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"lastName"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.adminUsers.lastName")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("dashboard.adminUsers.role")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("dashboard.adminUsers.role")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ROLES.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
          </form>
        </Form>
        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            className="w-auto"
            onClick={() => form.handleSubmit(handleSubmit)()}
          >
            {isPending ? (
              <>
                <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-current rounded-full inline-block align-middle" />
                {t("dashboard.adminUsers.Uploading")}
              </>
            ) : (
              t("dashboard.adminUsers.createUser")
            )}
          </Button>
        </div>
      </div>
    </ContentLayout>
  );
}
