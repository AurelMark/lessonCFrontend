"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { uploadHomepageFiles } from "@/api/uploads";
import { SERVER_URL } from "@/src/constants";
import { useUploadsStore } from "@/src/store/useUploadsStore";

type TUploadsSimpleDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

export function UploadSimpleDialog({
  open,
  setOpen,
}: TUploadsSimpleDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("");
  const setSelectedUrl = useUploadsStore((state) => state.setSelectedUrl);

  const mutation = useMutation({
    mutationFn: (files: File[]) => uploadHomepageFiles(files),
    onMutate: () => {
      toast.loading(t("homepage.uploading"), { id: "file-upload" });
    },
    onSuccess: (res) => {
      toast.dismiss("file-upload");
      toast.success(t("homepage.uploadSuccess"));
      if (res.files[0].path) {
        const fullUrl = `${SERVER_URL}${res.files[0].path}`.replace(
          /([^:]\/)\/+/g,
          "$1"
        );
        setSelectedUrl(fullUrl);
        setOpen(false);
      }
    },
    onError: () => {
      toast.dismiss("file-upload");
      toast.error(t("homepage.uploadError"));
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    mutation.mutate(Array.from(files));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("homepage.uploadFiles")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center space-y-4 py-6">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <Button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                {t("homepage.uploading")}
              </>
            ) : (
              t("homepage.uploadFiles")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
