"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ActivateAccountSchema, ActivateAccount } from "@/validation/login";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/componentsUI/input";
import Image from "next/image";
import Placeholder from "@/public/placeholder.svg";
import { Loader2 } from "lucide-react";
import { LANG_TYPE } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { activateAccountRequest } from "@/api/auth";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export function ActivateForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as string;

  const form = useForm<ActivateAccount>({
    resolver: zodResolver(ActivateAccountSchema),
    defaultValues: {
      email: "",
      login: "",
      firstName: "",
      lastName: "",
    },
    mode: "onTouched",
  });

  const handleActivateForm = useMutation({
    mutationFn: (data: ActivateAccount) => activateAccountRequest(data, id),
    onSuccess: () => {
      toast.success(
        <>
          <div className="font-bold">{t("activationSuccess")}</div>
          <div className="text-muted-foreground">
            {t("activationLoginInfo")}
          </div>
        </>
      );
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 5000);
    },
    onError: () => {
      toast.error(t("activationFailed"));
    },
  });

  const onSubmit = (data: ActivateAccount) => {
    handleActivateForm.mutate(data);
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      <Card className="overflow-hidden w-full">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 md:p-8 w-full max-w-md mx-auto flex flex-col"
              autoComplete="on"
            >
              <div className="flex flex-col gap-6 flex-1">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">
                    {t("activationTempAccountTitle")}
                  </h1>
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("email")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="login"
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
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("dashboard.adminUsers.firstName")}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("dashboard.adminUsers.lastName")}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full flex justify-center items-center"
                  disabled={handleActivateForm.isPending}
                >
                  {handleActivateForm.isPending ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    t("editData")
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <div className="relative hidden md:block bg-muted min-h-[400px]">
            <Image
              src={Placeholder}
              alt="Login path"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              draggable={false}
              priority
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
