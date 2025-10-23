"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { changePassword } from "@/api/client";
import {
  ChangePasswordData,
  ChangePasswordDataSchema,
} from "@/validation/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/componentsUI/form";
import { useTranslations } from "use-intl";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

type TProfileChangePasswordModalsProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  data: {
    login: string;
    email: string;
  };
};

export const ProfileChangePasswordModals = ({
  open,
  onOpenChange,
  data,
}: TProfileChangePasswordModalsProps) => {
  const t = useTranslations("profile");
  const form = useForm<ChangePasswordData>({
    resolver: zodResolver(ChangePasswordDataSchema),
    defaultValues: {
      email: data.email,
      login: data.login,
      newPassword: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((oldState) => !oldState);

  const handleChangePassword = useMutation({
    mutationFn: (data: ChangePasswordData) => changePassword(data),
    onSuccess: () => {
      toast.success(
        <>
          <div className="font-bold">{t("passwordUpdatedSuccess")}</div>
        </>
      );
    },
    onError: () => {
      toast.error(t("passwordUpdateError"));
    },
  });

  const handleSumbit = () => {
    const values = form.getValues();
    handleChangePassword.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="mb-4">{t("changePasswordTitle")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSumbit)}
            className="w-full space-y-6"
          >
            <div className="grid grid-cols-[1fr_30px] gap-2">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("newPassword")}</FormLabel>
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
            <DialogFooter className="flex !justify-center">
              <Button type="submit">{t("updatePassword")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
