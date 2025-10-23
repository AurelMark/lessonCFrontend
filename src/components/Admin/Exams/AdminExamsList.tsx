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
import { deleteGroupsById } from "@/api/groups";
import { Exams, ExamsArray } from "@/validation/exams";

type TAdminExamsList = {
  data: ExamsArray;
};

export const AdminExamsList = ({ data }: TAdminExamsList) => {
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
            {t("dashboard.adminExams.examDeletedSuccess")}
          </div>
        </>
      );
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });

  const handleEditGroups = (slug: string) =>
    router.push(`/${locale}/dashboard/exams/edit/${slug}`);


  return (
    <div className="flex flex-col gap-4">
      {data &&
        data.map((el: Exams, idx: number) => (
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
                      onClick={() => el.slug && handleEditGroups(el.slug)}
                    >
                      {t("dashboard.adminExams.editExamData")}
                      <DropdownMenuShortcut>
                        <Pencil />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => el.id && deleteMutation(el.id)}
                    >
                      {t("dashboard.adminExams.deleteExam")}
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
                {t("dashboard.adminExams.title")}: {el.title[locale]}
              </div>
              <div>
                {t("dashboard.adminExams.createdBy")}:{" "}
                {`${el.createdBy.firstName} ${el.createdBy.lastName}`}
              </div>
              <div className="flex gap-2">
                {t("dashboard.adminExams.responsible")}:{" "}
                {el.responsible?.map((responsible, index) => (
                  <div
                    key={index}
                  >{`${responsible.firstName} ${responsible.lastName}`}</div>
                ))}
              </div>
              <div className="flex gap-4 items-center">
                <div>{t("dashboard.adminExams.passed")}</div>
                <div className="flex gap-4">
                  {el.attempts && el.attempts.length > 0 ? (
                    <div>{el.attempts.length}</div>
                  ) : (
                    <Minus className="text-red-500" />
                  )}
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div>{t("dashboard.adminExams.lessons")}:</div>
                {el.lessons && el.lessons.length > 0 ? (
                  <div className="flex gap-4">
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
                              <p>
                                {t("dashboard.adminExams.redirectToGroups")}
                              </p>
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
            </div>
          </div>
        ))}
    </div>
  );
};
