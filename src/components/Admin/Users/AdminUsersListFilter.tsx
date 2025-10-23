import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/componentsUI/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { UsersFilter, UsersFilterForm } from "@/validation/users";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/componentsUI/form";
import { Input } from "@/componentsUI/input";
import { Button } from "@/componentsUI/button";
import { useUserFilter } from "@/store/useUserStore";
import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/componentsUI/select";
import { ROLES } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { getDictionaryGroups } from "@/api/dictionary";
import { MultiSelect } from "@/custom//MultiSelect";
import { LANG_TYPE } from "@/types";

type TAdminUsersListFilter = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
};

export const AdminUsersListFilter = ({
  open,
  onOpenChange,
}: TAdminUsersListFilter) => {
  const setFields = useUserFilter((state) => state.setFields);
  const login = useUserFilter((state) => state.login);
  const email = useUserFilter((state) => state.email);
  const role = useUserFilter((state) => state.role);
  const groups = useUserFilter((state) => state.groups);
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;

  const form = useForm<UsersFilter>({
    resolver: zodResolver(UsersFilterForm),
    defaultValues: {
      login: login ?? "",
      email: email ?? "",
      role: role ?? "",
      groups: groups ?? [],
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        login: login ?? "",
        email: email ?? "",
        role: role ?? "",
        groups: groups ?? [],
      });
    }
  }, [open, email, role, groups, login, form]);

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

  const handleOnSubmit = (data: UsersFilter) => {
    setFields({
      login: data.login || null,
      email: data.email || null,
      role: data.role || null,
      groups: data.groups || null,
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    form.reset({
      login: "",
      email: "",
      role: "",
      groups: [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("dashboard.adminUsers.filterUsersByFields")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleOnSubmit)}
            className="w-full space-y-6 text-center"
          >
            <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem className="w-full">
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
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("dashboard.adminUsers.email")}</FormLabel>
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
              title={t("dashboard.adminUsers.groups")}
              data={dataGroupsOptions}
              control={form.control}
              name="groups"
            />
            <div className="flex gap-2 justify-center">
              <Button variant="destructive" onClick={handleReset} type="button">
                {t("dashboard.adminUsers.resetFilter")}
              </Button>
              <Button type="submit">
                {t("dashboard.adminUsers.searchByFilter")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
