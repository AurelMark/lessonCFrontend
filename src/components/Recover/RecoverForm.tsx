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
import { LoginOTPFormValues, LoginOTPSchema } from "@/validation/login";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/componentsUI/input";
import Image from "next/image";
import Placeholder from "@/public/placeholder.svg";
import { LANG_TYPE } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordRequest, LoginOTPPayload } from "@/api/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function RecoverForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;
  const router = useRouter();

  const form = useForm<LoginOTPFormValues>({
    resolver: zodResolver(LoginOTPSchema),
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
  });

  const handleAuthToSystem = useMutation({
    mutationFn: (payload: LoginOTPPayload) => forgotPasswordRequest(payload),
    onSuccess: () => {
      toast.success(
        <>
          <div className="font-bold">{t("resetPasswordSuccess")}</div>
          <div className="text-muted-foreground">
            {t("resetPasswordCheckMail")}
          </div>
        </>
      );
      setTimeout(() => {
        router.push(`/${locale}/recover/success`);
      }, 5000);
    },
    onError: () => {
      toast.error(t("requestProcessingError"));
    },
  });

  const onSubmit = (data: LoginOTPFormValues) => {
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
                  <h1 className="text-2xl font-bold">{t("forgotPassword")}</h1>
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
                <Button
                  type="submit"
                  className="w-full flex justify-center items-center"
                  disabled={handleAuthToSystem.isPending}
                >
                  {handleAuthToSystem.isPending ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    t("resetPassword")
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
