"use client";

import { Badge } from "@/components/ui/badge";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTagBlogFilter } from "@/store/useTagBlogFilter";
import { cn } from "@/lib/utils";

type TagItemProps = {
  tag: string;
};

export default function TagItem({ tag }: TagItemProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { selectedTag, setTag } = useTagBlogFilter();

  const isActive = selectedTag === tag;

  const handleClick = () => {
    const current = new URLSearchParams(searchParams.toString());
    const isBlogDetailPage =
      pathname.includes("/blog/") && pathname.split("/").length > 3;

    if (isActive) {
      current.delete("tags");
      setTag(null);
      if (isBlogDetailPage) {
        router.push(`/blog`);
      } else {
        router.push(`${pathname}?${current.toString()}`);
      }
      return;
    }

    current.set("tags", tag);
    setTag(tag);

    if (isBlogDetailPage) {
      router.push(`/blog?${current.toString()}`);
    } else {
      router.push(`${pathname}?${current.toString()}`);
    }
  };

  return (
    <Badge
      onClick={handleClick}
      variant={isActive ? "default" : "outline"}
      className={cn("text-sm cursor-pointer select-none", {
        "bg-primary text-white": isActive,
      })}
    >
      #{tag}
    </Badge>
  );
}
