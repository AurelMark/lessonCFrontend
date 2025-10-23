"use client";

import { CircleX, EllipsisVertical, Link, Minus, Pencil } from "lucide-react";

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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/componentsUI/tooltip";
import { useLocale, useTranslations } from "next-intl";
import { LANG_TYPE } from "@/types";
import { Badge } from "@/componentsUI/badge";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Groups, GroupsList } from "@/validation/groups";
import { deleteGroupsById } from "@/api/groups";

type TAdminGroupList = {
  data: GroupsList;
};

export const AdminGroupList = ({ data }: TAdminGroupList) => {
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteGroupsById,
    onSuccess: () => {
      toast.success(
        <>
          <div className="font-bold">
            {t("dashboard.adminGroups.groupDeletedSuccess")}
          </div>
        </>
      );
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });

  const handleEditGroups = (id: string) =>
    router.push(`/${locale}/dashboard/groups/edit/${id}`);

  return (
    <div className="flex flex-col gap-4">
      {data.map((el: Groups, idx: number) => (
        <div key={idx} className="bg-background py-4 px-8">
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
                    onClick={() => el.id && handleEditGroups(el.id)}
                  >
                    {t("dashboard.adminGroups.editGroupData")}
                    <DropdownMenuShortcut>
                      <Pencil />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => el.id && deleteMutation(el.id)}
                  >
                    {t("dashboard.adminGroups.deleteGroup")}
                    <DropdownMenuShortcut>
                      <CircleX />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div
            className={cn("grid grid-cols-1 gap-x-8 gap-y-4 md:items-center")}
          >
            <div>
              {t("dashboard.adminGroups.title")}: {el.title[locale]}
            </div>
            <div>
              {t("dashboard.adminGroups.createdBy")}:{" "}
              {`${el.createdBy.firstName} ${el.createdBy.lastName}`}
            </div>
            <div className="flex gap-2">
              {t("dashboard.adminGroups.responsible")}:{" "}
              {el.responsible?.map((responsible, index) => (
                <div
                  key={index}
                >{`${responsible.firstName} ${responsible.lastName}`}</div>
              ))}
            </div>
            <div className="flex gap-4">
              <div className="mt-2">{t("dashboard.adminGroups.exams")}:</div>
              <div className="flex flex-wrap gap-2 max-w-full">
                {el.exams && el.exams.length > 0 ? (
                  el.exams?.map((exam, index) => (
                    <Badge key={index} variant="outline">
                      {exam.title[locale]}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost">
                              <Link />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t("dashboard.adminGroups.redirectToExams")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Badge>
                  ))
                ) : (
                  <Minus className="text-red-500" />
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-2">{t("dashboard.adminGroups.lessons")}:</div>
              {el.lessons && el.lessons.length > 0 ? (
                <div className="flex flex-wrap gap-2 max-w-full">
                  {el.lessons?.map((lesson, index) => (
                    <Badge key={index} variant="outline">
                      {lesson.title[locale]}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost">
                              <Link />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t("dashboard.adminGroups.redirectToGroups")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Badge>
                  ))}
                </div>
              ) : (
                <Minus className="text-red-500" />
              )}
            </div>
            <div className="flex gap-4">
              <div>{t('dashboard.adminGroups.users')}: </div>
              {el.users && el.users.length > 0 ? (
                el.users?.map((user, index) => (
                  <div key={index}>{`${user.firstName} ${user.lastName}`}</div>
                ))
              ) : (
                <Minus className="text-red-500" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
