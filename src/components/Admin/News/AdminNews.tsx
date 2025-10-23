"use client";

import Image from "next/image";
import { Button } from "@/componentsUI/button";
import { Card } from "@/componentsUI/card";
import { useLocale, useTranslations } from "next-intl";
import { NewsListParams } from "@/validation/news";
import { Badge } from "@/componentsUI/badge";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteNewsById } from "@/api/news";
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
import { deleteFolder } from "@/api/uploads";

type AdminNewsProps = {
  data: NewsListParams;
};

export function AdminNews({ data }: AdminNewsProps) {
  const locale = useLocale() as LANG_TYPE;
  const t = useTranslations();
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNewsById,
    onSuccess: () => {
      toast.success(
        <>
          <div className="font-bold">{t("dashboard.newsDeletedSuccess")}</div>
        </>
      );
      queryClient.invalidateQueries({ queryKey: ["news"] });
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
          <div className="font-bold">{t("dashboard.newsDeletedSuccess")}</div>
        </>
      );
    },
  });

  const handleOnEdit = (id: string, slug: string) => {
    router.push(`/${locale}/dashboard/news/edit/${slug}`);
  };

  const handleOnDelete = (id: string, slug: string) => {
    deleteMutation.mutate(id);
    deleteFolderMutation.mutate({
      scope: "public",
      category: "blog",
      folder: slug,
    });
  };

  return (
    <div className="space-y-4">
      {data.data.length === 0 && (
        <div className="text-muted-foreground text-center py-12">
          {t("dashboard.noNews")}
        </div>
      )}
      {data.data.map((item) => (
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
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {item.tags.map((tag) => (
                <Badge variant="outline" key={tag}>
                  {tag}
                </Badge>
              ))}
            </div>
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
                    {t("dashboard.editNews")}
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
                    {t("dashboard.deleteNews")}
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
