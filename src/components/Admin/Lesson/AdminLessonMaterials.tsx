"use client";

import { useRef, useState } from "react";
import { Button } from "@/componentsUI/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/componentsUI/dialog";
import { DndContext, closestCenter } from "@dnd-kit/core";
import type { DragEndEvent, DraggableAttributes } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseFormReturn, useWatch } from "react-hook-form";
import { LessonForm } from "@/validation/lesson";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/componentsUI/tooltip";
import { useTranslations } from "next-intl";

type Material = {
  id?: string;
  name: string;
  type: string;
  url: string;
  order: number;
  file?: File;
};

type TAdminLessonMaterialsProps = {
  form: UseFormReturn<LessonForm>;
};

function SortableMaterialRow({
  material,
  onDelete,
  listeners,
  attributes,
  isDragging,
}: {
  material: Material;
  onOrderChange: (order: number) => void;
  onDelete: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listeners: Record<string, any> | undefined;
  attributes: DraggableAttributes;
  isDragging: boolean;
}) {
  return (
    <div
      className={cn(
        "flex sm:items-center border rounded-xl py-2 px-3 mb-2 bg-background shadow-sm transition",
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
      <span className="flex-1 truncate ml-3">{material.name}</span>
      <span className="hidden sm:block w-32 ml-2 text-xs text-muted-foreground truncate">
        {material.type}
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

export function AdminLessonMaterials({ form }: TAdminLessonMaterialsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const materials =
    useWatch({ control: form.control, name: "materials" }) ?? [];
  const [open, setOpen] = useState(false);
  const title = useWatch({ control: form.control, name: "title.ro" });
  const t = useTranslations("dashboard.adminLesson");

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = materials.findIndex((i: Material) => i.id === active.id);
      const newIndex = materials.findIndex((i: Material) => i.id === over.id);
      const sorted = arrayMove(materials, oldIndex, newIndex).map(
        (m: Material, i: number) => ({
          ...m,
          order: i + 1,
        })
      );
      form.setValue("materials", sorted);
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const uploaded: Material[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      uploaded.push({
        id: Math.random().toString(36).slice(2) + Date.now(),
        name: file.name,
        type: file.type || "file",
        url: URL.createObjectURL(file),
        order: (materials.length || 0) + uploaded.length,
        file,
      });
    }
    form.setValue(
      "materials",
      [...materials, ...uploaded].map((m: Material, i: number) => ({
        ...m,
        order: i + 1,
      }))
    );
  };

  const handleOrderChange = (id: string, value: number) => {
    let updated = materials.map((mat: Material) =>
      mat.id === id ? { ...mat, order: value } : mat
    );
    updated = updated
      .sort((a: Material, b: Material) => a.order - b.order)
      .map((mat: Material, i: number) => ({ ...mat, order: i + 1 }));
    form.setValue("materials", updated);
  };

  const handleDelete = (id: string) => {
    const updated = materials
      .filter((mat: Material) => mat.id !== id)
      .map((mat: Material, i: number) => ({ ...mat, order: i + 1 }));
    form.setValue("materials", updated);
  };

  const handleResetMaterials = () => {
    form.setValue("materials", []);
  };

  const handleClose = () => {
    setOpen((oldState) => !oldState);
  };

  function RowWrapper({ ...props }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: props.material.id });
    return (
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
      >
        <SortableMaterialRow
          material={props.material}
          onOrderChange={(value) => handleOrderChange(props.material.id, value)}
          onDelete={() => handleDelete(props.material.id)}
          listeners={listeners}
          attributes={attributes}
          isDragging={isDragging}
        />
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-end">
        <DialogTrigger asChild>
          {!title ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" variant="secondary" className="mb-2">
                  {t("uploadsMaterials")} ({materials.length})
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("FillTitleFirst")}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button variant="outline">
              {t("uploadsMaterials")} ({materials.length})
            </Button>
          )}
        </DialogTrigger>
        {materials.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                type="button"
                onClick={handleResetMaterials}
              >
                <X />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("clearAllMaterials")}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("uploadsMaterials")}</DialogTitle>
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
            <span className="text-base font-medium">{t("dragDrop")}</span>
            <span className="text-sm text-muted-foreground">
              {t("acceptedTypes")}
            </span>
          </div>
          <div className="mt-4 overflow-y-auto max-h-[600px]">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={materials.map((m) => m.id).filter(Boolean) as string[]}
                strategy={verticalListSortingStrategy}
              >
                {materials.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-8">
                    {t("noMaterials")}
                  </div>
                )}
                {materials
                  .sort((a, b) => a.order - b.order)
                  .map((material, idx) => (
                    <RowWrapper key={idx} material={material} />
                  ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
        <DialogFooter className="flex flex-row justify-center sm:justify-center">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={handleClose}>
              {t("close")}
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleClose}>
            {t("uploadFiles")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
