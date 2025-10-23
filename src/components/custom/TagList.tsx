"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useTagNewsFilter } from "@/store/useTagNewsFilter";

type TagsListProps = {
  tags: string[];
};

export default function TagsList({ tags }: TagsListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { selectedTag, setTag } = useTagNewsFilter();

  const handleClick = (tag: string) => {
    const current = new URLSearchParams(searchParams.toString());

    const isActive = selectedTag === tag;

    if (isActive) {
      current.delete("tagsSearch");
      setTag(null);
    } else {
      current.set("tagsSearch", tag);
      setTag(tag);
    }

    router.push(`${pathname}?${current.toString()}`);
  };

  const clearFilter = () => {
    const current = new URLSearchParams(searchParams.toString());
    current.delete("tagsSearch");
    router.push(`${pathname}?${current.toString()}`);
    setTag(null);
  };

  return (
    <div className="flex items-center flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge
          key={tag}
          onClick={() => handleClick(tag)}
          variant={selectedTag === tag ? "default" : "outline"}
          className="cursor-pointer select-none"
        >
          #{tag}
        </Badge>
      ))}
      {selectedTag && (
        <button
          onClick={clearFilter}
          className="text-sm text-muted-foreground underline hover:text-foreground ml-2"
        >
          Сбросить
        </button>
      )}
    </div>
  );
}
