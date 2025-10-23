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
import { ChangePassword, ChangePasswordSchema } from "@/validation/login";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/componentsUI/input";
import Image from "next/image";
import Placeholder from "@/public/placeholder.svg";
import { LANG_TYPE } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { changePasswordRequest } from "@/api/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/componentsUI/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";

export function RecoverPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;
  const router = useRouter();

  const form = useForm<ChangePassword>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      email: "",
      otpCode: "",
      newPassword: "",
    },
    mode: "onTouched",
  });

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((oldState) => !oldState);

  const handleAuthToSystem = useMutation({
    mutationFn: (payload: ChangePassword) => changePasswordRequest(payload),
    onSuccess: () => {
      toast.success(
        <>
          <div className="font-bold">{t("passwordChangedSuccess")}</div>
          <div className="text-muted-foreground">
            {t("loginWithNewPassword")}
          </div>
        </>
      );
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 5000);
    },
    onError: () => {
      toast.error(t("passwordChangeError"));
    },
  });

  const onSubmit = (data: ChangePassword) => {
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
                  <h1 className="text-2xl font-bold">
                    {t("profile.changePasswordTitle")}
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
                <div className="grid grid-cols-[1fr_30px] gap-2">
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("profile.newPassword")}</FormLabel>
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={toggleShowPassword}
                    className="mt-5"
                  >
                    {showPassword ? <EyeClosed /> : <Eye />}
                  </Button>
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
                    t("profile.changePasswordTitle")
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
