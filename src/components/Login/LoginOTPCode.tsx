"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { LoginOTPCode, LoginOTPCodeSchema } from "@/validation/login";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/componentsUI/button";
import { Card, CardContent } from "@/componentsUI/card";
import Image from "next/image";
import Placeholder from "@/public/placeholder.svg";
import { LANG_TYPE } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { loginOTPCode, LoginOTPCodePayload } from "@/api/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useUserStore, User } from "@/store/useAuthStore";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";

export function LoginOTPCodeForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const form = useForm<LoginOTPCode>({
    resolver: zodResolver(LoginOTPCodeSchema),
    defaultValues: {
      email: email || "",
      otpCode: "",
    },
    mode: "onTouched",
  });

  const handleLoginSuccess = (user: User) => {
    useUserStore.getState().setUser(user);
    Cookies.set("user", JSON.stringify(user), { expires: 7 });
  };

  const handleAuthToSystem = useMutation({
    mutationFn: (payload: LoginOTPCodePayload) => loginOTPCode(payload),
    onSuccess: (data) => {
      handleLoginSuccess(data.user);
      toast.success(
        <>
          <div className="font-bold">{t("loginSuccess")}</div>
          <div className="text-muted-foreground">{t("redirectInfo")}</div>
        </>
      );
      setTimeout(() => {
        router.push(`/${locale}`);
      }, 5000);
    },
    onError: () => {
      toast.error(t("OTP.loginError"));
    },
  });

  const onSubmit = (data: LoginOTPCode) => {
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
                  name="otpCode"
                  render={({ field, formState }) => {
                    const error = formState.errors.otpCode;
                    return (
                      <FormItem>
                        <FormLabel>{t("OTP.enterOtp")}</FormLabel>
                        <FormControl className="border-0">
                          <div className={cn("flex justify-center")}>
                            <div
                              className={cn(
                                "inline-flex rounded-lg max-w-fit",
                                error && "border border-destructive"
                              )}
                            >
                              <InputOTP
                                maxLength={6}
                                {...field}
                                pattern={REGEXP_ONLY_DIGITS}
                              >
                                <InputOTPGroup>
                                  <InputOTPSlot index={0} />
                                  <InputOTPSlot index={1} />
                                  <InputOTPSlot index={2} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                  <InputOTPSlot index={3} />
                                  <InputOTPSlot index={4} />
                                  <InputOTPSlot index={5} />
                                </InputOTPGroup>
                              </InputOTP>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <Button
                  type="submit"
                  className="w-full flex justify-center items-center"
                  disabled={handleAuthToSystem.isPending}
                >
                  {handleAuthToSystem.isPending ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    t("OTP.confirmOtp")
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
