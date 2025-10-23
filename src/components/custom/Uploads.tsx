"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteFilesHomepage, getFolder } from "@/api/uploads";
import { useUploadsStore } from "@/store/useUploadsStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Copy,
  FileText,
  Folder,
  Loader2,
  LoaderCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/componentsUI/tooltip";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { UploadsHomepage } from "../Admin/Uploads/UploadsHomepage";
import { toast } from "sonner";
import { SERVER_URL } from "@/constants";
import { joinUrl } from "@/lib/utils";

type FileExplorerModalProps = {
  title?: string;
};

export function FileExplorerModal({}: FileExplorerModalProps) {
  const { open, reset, type, url, setUrl } = useUploadsStore();
  const [uploadOpen, setUploadOpen] = useState(false);
  const t = useTranslations();
  const queryClient = useQueryClient();

  const {
    data: dataFolder,
    isLoading: loadingFolder,
    error: errorFolder,
  } = useQuery({
    queryKey: ["getFolder", type, url],
    queryFn: () => getFolder(type, url),
    enabled: !!type,
    staleTime: 0,
    gcTime: 0,
  });

  const files = dataFolder ?? [];
  const segments = url ? url.split("/").filter(Boolean) : [];
  const showBack = segments.length > 2;

  const handleClickUrl = (url: string) => {
    setUrl(url);
  };

  const handleBack = () => {
    if (!url) return;
    const parts = url.split("/");
    parts.pop();
    const parentUrl = parts.join("/");
    setUrl(parentUrl || "");
  };

  const handleUploadFiles = () => {
    setUploadOpen(true);
  };

  const deleteFilesMutation = useMutation({
    mutationFn: (filename: string) => deleteFilesHomepage(filename),
    onSuccess: () => {
      toast.success(
        <>
          <div className="font-bold">{t("homepage.deleteSuccess")}</div>
        </>
      );
      queryClient.invalidateQueries({ queryKey: ["getFolder"] });
    },
    onError: () => {
      toast.error(t("homepage.deleteError"));
    },
  });

  const handleDeleteFiles = (filename: string) => {
    deleteFilesMutation.mutate(filename);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={reset}>
        <DialogContent className="max-w-7xl w-full">
          <DialogHeader>
            <DialogTitle>{t("files.fileManager")}</DialogTitle>
          </DialogHeader>
          {showBack && !url.includes("homepage") ? (
            <Button
              variant="secondary"
              className="mb-2 w-full"
              onClick={handleBack}
            >
              <ArrowLeft /> {t("files.back")}
            </Button>
          ) : (
            <Button className="mb-2 w-full" onClick={handleUploadFiles}>
              <Plus /> {t("homepage.addFile")}
            </Button>
          )}
          <div className="max-h-[60vh] overflow-y-auto px-1">
            {loadingFolder && (
              <div className="flex items-center justify-center w-full py-12">
                <LoaderCircle className="w-10 h-10 text-primary animate-spin" />
              </div>
            )}
            {(!files || files.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                {t("files.noFiles")}
              </div>
            )}

            {errorFolder && (
              <div className="text-center py-8 text-muted-foreground">
                {t("files.loadError")}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2">
              {files.map((item) => (
                <TooltipProvider key={item.url}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative group">
                        <Button
                          variant="outline"
                          className="flex flex-col items-center justify-center px-2 py-4 gap-2 transition-colors hover:bg-secondary rounded-xl h-28 w-full"
                          onClick={() =>
                            item.type === "folder"
                              ? handleClickUrl?.(item.url)
                              : window.open(joinUrl(SERVER_URL, item.url))
                          }
                        >
                          {item.type === "folder" ? (
                            <Folder className="w-8 h-8 text-yellow-600" />
                          ) : (
                            <FileText className="w-8 h-8 text-blue-600" />
                          )}
                          <span className="truncate w-full text-lg font-medium">
                            {item.name}
                          </span>
                        </Button>

                        {item.type === "file" && (
                          <div className="absolute bottom-0 left-0 w-full flex justify-center gap-2 bg-background rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity py-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-accent"
                              onClick={async (e) => {
                                e.stopPropagation();
                                await navigator.clipboard.writeText(
                                  joinUrl(SERVER_URL, item.url)
                                );
                                toast.success(t("homepage.copySuccess"));
                              }}
                            >
                              <Copy className="w-5 h-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-destructive"
                              disabled={deleteFilesMutation.isPending}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFiles(item.url);
                              }}
                            >
                              {deleteFilesMutation.isPending ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5" />
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <UploadsHomepage open={uploadOpen} onOpenChange={setUploadOpen} />
    </>
  );
}
