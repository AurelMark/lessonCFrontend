"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DndContext, closestCenter } from "@dnd-kit/core";
import type { DraggableAttributes, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadHomepageFiles } from "@/api/uploads";
import { toast } from "sonner";

type Material = {
  id?: string;
  name: string;
  type: string;
  url: string;
  order: number;
  file?: File;
};

type TUploadsHomepageProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
};

function SortableFileRow({
  file,
  onDelete,
  listeners,
  attributes,
  isDragging,
}: {
  file: Material;
  onDelete: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listeners: Record<string, any> | undefined;
  attributes: DraggableAttributes;
  isDragging: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center border rounded-xl py-2 px-3 mb-2 bg-background shadow-sm transition",
        isDragging && "opacity-50 ring-2 ring-primary"
      )}
      style={{
        touchAction: "manipulation",
        userSelect: "none",
      }}
    >
      <span
        {...listeners}
        {...attributes}
        className="cursor-grab mr-2 p-1 rounded hover:bg-accent"
        tabIndex={-1}
      >
        <GripVertical size={18} />
      </span>
      <span className="flex-1 truncate ml-3">{file.name}</span>
      <span className="hidden sm:block w-32 ml-2 text-xs text-muted-foreground truncate">
        {file.type}
      </span>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="ml-3"
        onClick={onDelete}
        aria-label="Delete"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
}

function RowWrapper({ ...props }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.file.id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <SortableFileRow
        file={props.file}
        onDelete={props.onDelete}
        listeners={listeners}
        attributes={attributes}
        isDragging={isDragging}
      />
    </div>
  );
}

export function UploadsHomepage({ open, onOpenChange }: TUploadsHomepageProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<Material[]>([]);
  const t = useTranslations();
  const queryClient = useQueryClient();

  const multipleFilemutation = useMutation<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    Error,
    { files: File[] }
  >({
    mutationFn: ({ files }) => uploadHomepageFiles(files),
    onMutate: () => {
      toast.loading(t("homepage.uploading"), {
        id: "file-upload",
      });
    },
    onSuccess: () => {
      toast.dismiss("file-upload");
      toast.success(t("homepage.uploadSuccess"));
      onOpenChange(false);
      setFiles([]);
      queryClient.invalidateQueries({ queryKey: ["getFolder"] });
    },
    onError: () => {
      toast.dismiss("file-upload");
      toast.error(t("homepage.uploadError"));
    },
  });

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles = Array.from(fileList).map((file, i) => ({
      id: Math.random().toString(36).slice(2) + Date.now() + i,
      name: file.name,
      type: file.type || "file",
      url: URL.createObjectURL(file),
      order: files.length + i + 1,
      file,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = files.findIndex((f) => f.id === active.id);
      const newIndex = files.findIndex((f) => f.id === over.id);
      setFiles((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  const handleUpload = () => {
    const filesData = files.map((f) => f.file).filter((f): f is File => !!f);
    multipleFilemutation.mutate({ files: filesData });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("homepage.uploadFiles")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-muted rounded-xl p-6 bg-accent cursor-pointer flex flex-col items-center justify-center gap-3 hover:bg-accent/60 transition"
            onClick={() => inputRef.current?.click()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <span className="text-base font-medium">
              {t("homepage.dragDrop")}
            </span>
            <span className="text-sm text-muted-foreground">
              {t("homepage.acceptedTypes")}
            </span>
          </div>
          <div className="mt-4 overflow-y-auto max-h-[400px]">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={files.map((f) => f.id!).filter(Boolean)}
                strategy={verticalListSortingStrategy}
              >
                {files.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-8">
                    {t("homepage.noFiles")}
                  </div>
                )}
                {files.map((file) => (
                  <RowWrapper
                    key={file.id}
                    file={file}
                    onDelete={() => file.id && handleDelete(file.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
        <DialogFooter className="flex !justify-center gap-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {t("homepage.close")}
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={files.length === 0 || multipleFilemutation.isPending}
          >
            {multipleFilemutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              t("homepage.uploadFiles")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
