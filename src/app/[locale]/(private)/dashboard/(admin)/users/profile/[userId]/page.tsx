"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { Button } from "@/componentsUI/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
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

import { UserFormEdit, UserFormEditSchema } from "@/validation/users";
import {
  activateUser,
  editUserById,
  forgotPassword,
  getUserById,
} from "@/api/users";
import { useEffect } from "react";
import { getDictionaryGroups } from "@/api/dictionary";
import { MultiSelect } from "@/custom/MultiSelect";
import { Switch } from "@/componentsUI/switch";

type TGroupsData = {
  title: {
    ro: string;
    ru: string;
    en: string;
  };
  id: string;
};

export default function AdminProfilePage() {
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;
  const { userId } = useParams() as { userId: string };
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<UserFormEdit>({
    resolver: zodResolver(UserFormEditSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      login: "",
      role: "",
      isActive: false,
      groups: [],
      isVerified: false,
    },
  });

  const activeWatchField = form.watch("isActive");

  const { data, isLoading } = useQuery({
    queryKey: ["userById", userId],
    queryFn: () => getUserById(userId),
    staleTime: 0,
    gcTime: 0,
  });

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

  useEffect(() => {
    if (data && !isLoading) {
      form.reset({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        login: data.login,
        role: data.role,
        isActive: data.isActive,
        groups: (data.groups || []).map((el: TGroupsData | string) =>
          typeof el === "string" ? el : el.id
        ),
        isVerified: data.isVerified,
      });
    }
  }, [data, form, isLoading]);

  const { mutate: editUserMutation, isPending } = useMutation({
    mutationFn: (data: UserFormEdit) => editUserById(userId, data),
    onSuccess: () => {
      toast.success(t("dashboard.adminUsers.userCreateSuccess"));
      router.push(`/${locale}/dashboard/users`);
    },
    onError: () => {
      toast.error(t("dashboard.adminUsers.userCreateError"));
    },
  });

  const { mutate: forgotPasswordMutation, isPending: isPendingForgotPassword } =
    useMutation({
      mutationFn: (email: string) => forgotPassword(email),
      onSuccess: () => {
        toast.success(t("dashboard.adminUsers.resetPasswordSuccess"));
      },
      onError: () => {
        toast.error(t("dashboard.adminUsers.resetPasswordError"));
      },
    });

  const { mutate: activatedMutation, isPending: isPendingActivate } =
    useMutation({
      mutationFn: (activate: boolean) => activateUser({ id: userId, activate }),
      onSuccess: () => {
        toast.success(t("dashboard.adminUsers.accountStatusUpdated"));
        queryClient.invalidateQueries({ queryKey: ["userById"] });
      },
      onError: () => {
        toast.error(t("dashboard.adminUsers.accountStatusUpdateError"));
      },
    });

  const handleSubmit = async (data: UserFormEdit) => {
    editUserMutation(data);
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
            <FormField
              control={form.control}
              name="isVerified"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-0.5">
                    <FormLabel>
                      {t("dashboard.adminUsers.verified")}
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
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            variant={activeWatchField ? "destructive" : "secondary"}
            onClick={() => {
              activatedMutation(!activeWatchField);
            }}
          >
            {isPendingActivate ? (
              <>
                <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-current rounded-full inline-block align-middle" />
                {t("dashboard.adminUsers.Uploading")}
              </>
            ) : activeWatchField ? (
              t("dashboard.adminUsers.deactivateAccount")
            ) : (
              t("dashboard.adminUsers.activateAccount")
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              const email = form.getValues("email");
              forgotPasswordMutation(email);
            }}
          >
            {isPendingForgotPassword ? (
              <>
                <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-current rounded-full inline-block align-middle" />
                {t("dashboard.adminUsers.Uploading")}
              </>
            ) : (
              t("dashboard.adminUsers.resetPassword")
            )}
          </Button>
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
              t("dashboard.adminUsers.editUserData")
            )}
          </Button>
        </div>
      </div>
    </ContentLayout>
  );
}
