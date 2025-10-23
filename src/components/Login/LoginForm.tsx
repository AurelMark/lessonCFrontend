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
import { LoginSchema, LoginFormValues } from "@/validation/login";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/componentsUI/input";
import Image from "next/image";
import Placeholder from "@/public/placeholder.svg";
import { RectangleEllipsis, Loader2 } from "lucide-react";
import { LANG_TYPE } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { loginRequest, LoginPayload } from "@/api/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useUserStore, User } from "@/store/useAuthStore";
import Link from "next/link";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const handleLoginSuccess = (user: User) => {
    useUserStore.getState().setUser(user);
    Cookies.set("user", JSON.stringify(user), { expires: 7 });
  };

  const handleAuthToSystem = useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
    onSuccess: (data) => {
      handleLoginSuccess(data.user);
      toast.success(
        <>
          <div className="font-bold">{t("loginSuccess")}</div>
          <div className="text-muted-foreground">{t("redirectInfo")}</div>
        </>
      );
      setTimeout(() => {
        if (data.user.isTempAccount) {
          const params = new URLSearchParams({
            ...(data.user.id && { id: data.user.id }),
          });

         router.push(
            `/${locale}/activate${params.toString() ? `?${params}` : ""}`
          );
        } else if (!data.user.isVerified) {
          const params = new URLSearchParams({
            ...(data.user.email && { email: data.user.email }),
            ...(data.user.login && { login: data.user.login }),
          });

          router.push(
            `/${locale}/verify${params.toString() ? `?${params}` : ""}`
          );
        } else {
          router.push(`/${locale}`);
        }
      }, 5000);
    },
    onError: () => {
      toast.error(t("loginError"));
    },
  });

  const handleRedirectToOTP = () => router.push(`/${locale}/login/otp/request`);

  const onSubmit = (data: LoginFormValues) => {
    handleAuthToSystem.mutate(data);
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
                  <h1 className="text-2xl font-bold">{t("loginTitle")}</h1>
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>{t("password")}</FormLabel>
                        <Link
                          href={`/${locale}/recover`}
                          className="text-sm underline-offset-2 hover:underline"
                        >
                          {t("forgotPassword")}
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full flex justify-center items-center"
                  disabled={handleAuthToSystem.isPending}
                >
                  {handleAuthToSystem.isPending ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    t("login")
                  )}
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    {t("orUseOBT")}
                  </span>
                </div>
                <div className="my-4">
                  <Button
                    variant="secondary"
                    className="w-full flex justify-center items-center py-6"
                    type="button"
                    onClick={handleRedirectToOTP}
                  >
                    <RectangleEllipsis className="!w-12 !h-12" />
                  </Button>
                </div>
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
