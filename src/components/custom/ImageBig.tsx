import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

export function ImageBig({
  images,
}: {
  images: { url: string; name: string }[];
}) {
  const t = useTranslations('learn.lesson');
  const [open, setOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState<{
    url: string;
    name: string;
  } | null>(null);

  const handleOpen = (img: { url: string; name: string }) => {
    setSelectedImg(img);
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-8">
      {images.length > 0 && (
        <div className="flex flex-wrap gap-4 justify-center">
          {images.map((img) => (
            <div
              key={img.url}
              className="relative w-64 h-40 rounded-lg overflow-hidden border bg-muted cursor-pointer hover:ring-2 ring-primary transition"
              onClick={() => handleOpen(img)}
            >
              <Image
                src={img.url}
                alt={img.name}
                fill
                className="object-cover"
                sizes="(max-width: 600px) 100vw, 33vw"
                unoptimized
              />
            </div>
          ))}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full flex flex-col items-center">
          <DialogTitle>
            <VisuallyHidden>
              {t('viewImage')} {selectedImg?.name}
            </VisuallyHidden>
          </DialogTitle>
          <DialogDescription>
            <VisuallyHidden>
              {t('closeHint')}
            </VisuallyHidden>
          </DialogDescription>
          {selectedImg && (
            <Image
              src={selectedImg.url}
              alt={selectedImg.name}
              width={800}
              height={600}
              className="rounded-lg w-full h-auto object-contain"
              unoptimized
            />
          )}
          <div className="mt-2 text-sm text-muted-foreground">
            {selectedImg?.name}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
