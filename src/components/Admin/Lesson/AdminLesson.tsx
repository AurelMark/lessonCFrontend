"use client";

import Image from "next/image";
import { Button } from "@/componentsUI/button";
import { Card } from "@/componentsUI/card";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/componentsUI/dropdown-menu";
import { CircleX, EllipsisVertical, Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/componentsUI/tooltip";
import { toast } from "sonner";
import { LANG_TYPE } from "@/types";
import { LessonArray } from "@/validation/lesson";
import { deleteLessonById } from "@/api/lesson";
import { deleteFolder } from "@/api/uploads";

type AdminNewsProps = {
  data: LessonArray;
};

export function AdminLesson({ data }: AdminNewsProps) {
  const locale = useLocale() as LANG_TYPE;
  const t = useTranslations();
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteLessonById,
    onSuccess: () => {
      toast.success(
        <>
          <div className="font-bold">
            {t("dashboard.adminLesson.lessonDeletedSuccess")}
          </div>
        </>
      );
      queryClient.invalidateQueries({ queryKey: ["lesson"] });
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: ({
      scope,
      category,
      folder,
    }: {
      scope: string;
      category: string;
      folder: string;
    }) => deleteFolder(scope, category, folder),
    onSuccess: () => {
      toast.success(
        <>
          <div className="font-bold">
            {t("dashboard.adminLesson.lessonDeletedSuccess")}
          </div>
        </>
      );
    },
  });

  const handleOnEdit = (id: string, slug: string) => {
    router.push(`/${locale}/dashboard/lesson/edit/${slug}`);
  };

  const handleOnDelete = (id: string, slug: string) => {
    deleteMutation.mutate(id);
    deleteFolderMutation.mutate({
      scope: "private",
      category: "lesson",
      folder: slug,
    });
  };

  return (
    <div className="space-y-4">
      {data.length === 0 && (
        <div className="text-muted-foreground text-center py-12">
          {t("dashboard.noLesson")}
        </div>
      )}
      {data.map((item) => (
        <Card
          key={item.slug}
          className="flex flex-row items-start gap-6 p-4 md:p-6"
        >
          <div className="w-0 sm:w-20 md:w-32 h-20 relative rounded overflow-hidden bg-muted shrink-0">
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={item.title[locale]}
                fill
                className="object-cover"
                unoptimized
              />
            )}
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h2 className="font-semibold text-lg">{item.title[locale]}</h2>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {item.description[locale]}
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0 ml-4">
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
                    onClick={() =>
                      item?.slug && item.id && handleOnEdit(item.id, item?.slug)
                    }
                  >
                    {t("dashboard.adminLesson.EditLesson")}
                    <DropdownMenuShortcut>
                      <Pencil />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      item.id && item.slug && handleOnDelete(item.id, item.slug)
                    }
                  >
                    {t("dashboard.adminLesson.deleteLesson")}
                    <DropdownMenuShortcut>
                      <CircleX />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      ))}
    </div>
  );
}
