"use client";

import { Check, CircleX, EllipsisVertical, Minus, Pencil } from "lucide-react";

import { Button } from "@/componentsUI/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { User } from "@/lib/validation/users";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/componentsUI/tooltip";
import { useLocale, useTranslations } from "next-intl";
import { Separator } from "@/componentsUI/separator";
import { LANG_TYPE } from "@/types";
import { Badge } from "@/componentsUI/badge";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserById } from "@/api/users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type TAdminUserList = {
  data: User[];
};

type TGroupsData = {
  title: {
    ro: string;
    ru: string;
    en: string;
  };
  id: string;
};

export const AdminUsersList = ({ data }: TAdminUserList) => {
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteMutation = useMutation({
    mutationFn: deleteUserById,
    onSuccess: () => {
      toast.success(
        <>
          <div className="font-bold">
            {t("dashboard.adminUsers.userDeletedSuccess")}
          </div>
        </>
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleEditProfile = (id: string) =>
    router.push(`/${locale}/dashboard/users/profile/${id}`);

  return (
    <div className="flex flex-col gap-4">
      {data.length === 0 && (
        <div className="bg-background py-4 px-8 text-center">{t("noData")}</div>
      )}
      {data.map((el: User) => (
        <div key={el.id} className="bg-background py-4 px-8">
          <div
            className={cn(
              "grid grid-cols-1 gap-x-8 gap-y-4 md:items-center",
              locale === "ru"
                ? "md:grid-cols-[1fr_100px_100px_180px_40px]"
                : "md:grid-cols-[1fr_100px_100px_100px_40px]"
            )}
          >
            <div>
              {t("dashboard.adminUsers.email")} {el.email}
            </div>
            <div className="flex gap-2">
              {t("dashboard.adminUsers.role")}{" "}
              <Badge variant="secondary">{el.role}</Badge>
            </div>
            <div className="flex gap-4">
              {t("dashboard.adminUsers.active")}:{" "}
              {el.isActive ? (
                <Check className="text-lime-500" />
              ) : (
                <Minus className="text-red-500" />
              )}
            </div>
            <div className="flex gap-4">
              {t("dashboard.adminUsers.verified")}:{" "}
              {el.isVerified ? (
                <Check className="text-lime-500" />
              ) : (
                <Minus className="text-red-500" />
              )}
            </div>
            <div className="absolute right-8 sm:right-12">
              <DropdownMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon">
                          <EllipsisVertical />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("dashboard.options")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => el.id && handleEditProfile(el.id)}
                    >
                      {t("dashboard.adminUsers.editUser")}
                      <DropdownMenuShortcut>
                        <Pencil />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => el.id && deleteMutation.mutate(el.id)}
                    >
                      {t("dashboard.adminUsers.deleteUser")}
                      <DropdownMenuShortcut>
                        <CircleX />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <Separator className="mt-4" />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                {t("dashboard.adminUsers.moreDetails")}
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
                <div className="font-semibold">
                  {t("dashboard.adminUsers.login")}
                </div>
                <div>{el.login}</div>

                <div className="font-semibold">
                  {t("dashboard.adminUsers.firstName")}
                </div>
                <div>{el.firstName}</div>

                <div className="font-semibold">
                  {t("dashboard.adminUsers.lastName")}
                </div>
                <div>{el.lastName}</div>

                <div className="font-semibold">
                  {t("dashboard.adminUsers.role")}
                </div>
                <div>
                  <Badge variant="secondary">{el.role}</Badge>
                </div>

                <div className="font-semibold">
                  {t("dashboard.adminUsers.groups")}
                </div>
                <div>
                  {el.groups && el.groups.length ? (
                    el.groups.map((g: TGroupsData | string) =>
                      typeof g === "string" ? (
                        <div key={g}>{g}</div>
                      ) : (
                        <div key={g.id}>{g.title[locale]}</div>
                      )
                    )
                  ) : (
                    <Minus className="inline text-red-500" />
                  )}
                </div>

                <div className="font-semibold">
                  {t("dashboard.adminUsers.verified")}
                </div>
                <div>
                  {el.isVerified ? (
                    <Check className="inline text-lime-500" />
                  ) : (
                    <Minus className="inline text-red-500" />
                  )}
                </div>

                <div className="font-semibold">
                  {t("dashboard.adminUsers.tempAccount")}
                </div>
                <div>
                  {el.isTempAccount ? (
                    <Check className="inline text-lime-500" />
                  ) : (
                    <Minus className="inline text-red-500" />
                  )}
                </div>

                <div className="font-semibold">
                  {t("dashboard.adminUsers.active")}
                </div>
                <div>
                  {el.isActive ? (
                    <Check className="inline text-lime-500" />
                  ) : (
                    <Minus className="inline text-red-500" />
                  )}
                </div>

                <div className="font-semibold">
                  {t("dashboard.adminUsers.examAttempts")}
                </div>
                <div>
                  {el.examAttempts && el.examAttempts.length ? (
                    el.examAttempts.length +
                    ` ${t("dashboard.adminUsers.examAttempts")}`
                  ) : (
                    <Minus className="inline text-red-500" />
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  );
};
