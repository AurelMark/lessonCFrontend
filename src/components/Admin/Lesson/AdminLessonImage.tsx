"use client";

import { Image as ImageLucide } from "lucide-react";
import { Button } from "@/componentsUI/button";
import { useTranslations } from "next-intl";
import { UseFormReturn, useWatch } from "react-hook-form";
import { useEffect, useMemo, useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/componentsUI/tooltip";
import { cn } from "@/lib/utils";
import { LessonForm } from "@/validation/lesson";

type TAdminNewsImageProps = {
  form: UseFormReturn<LessonForm>;
  setSelectedFile: (file: File) => void;
  isPending: boolean;
  selectedFile: File | null;
};

export function AdminLessonImage({
  form,
  setSelectedFile,
  isPending,
  selectedFile,
}: TAdminNewsImageProps) {
  const t = useTranslations("dashboard.adminLesson");
  const title = useWatch({ control: form.control, name: "title.ro" });
  const imageUrl = useWatch({ control: form.control, name: "imageUrl" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wasSubmitted = form.formState.submitCount > 0;

  const preview = useMemo(() => {
    if (typeof window === "undefined") return null;
    if (selectedFile) return URL.createObjectURL(selectedFile);
    if (imageUrl) return imageUrl;
    return null;
  }, [selectedFile, imageUrl]);

  useEffect(() => {
    return () => {
      if (selectedFile && preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [selectedFile, preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-x-8 items-center gap-y-4">
      <div className="flex justify-center">
        <div
          className={cn(
            "border border-solid aspect-square w-40 h-40 flex items-center justify-center overflow-hidden bg-muted/40 rounded-md relative",
            !selectedFile && wasSubmitted && "!border-red-500"
          )}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Preview"
              className="object-cover w-full h-full"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <ImageLucide className="w-24 h-24 text-muted-foreground" />
          )}
        </div>
      </div>
      <div className="flex justify-center sm:justify-start">
      <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {!title ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                className="mb-2"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-current rounded-full inline-block align-middle" />
                    {t("Uploading")}
                  </>
                ) : (
                  t("UploadLessonImage")
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("FillTitleFirst")}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button
            type="button"
            variant={wasSubmitted && title ? "destructive" : "secondary"}
            onClick={handleClick}
            className="mb-2"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-current rounded-full inline-block align-middle" />
                {t("Uploading")}
              </>
            ) : (
              t("UploadLessonImage")
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
