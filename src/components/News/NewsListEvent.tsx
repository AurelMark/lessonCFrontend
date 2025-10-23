"use client";
import { useLocale, useTranslations } from "next-intl";
import { NewsEvent } from "@/validation/news";
import { LANG_TYPE } from "@/types";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/componentsUI/button";

import { ChevronsRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import TagItem from "@/components/custom/TagItem";

type TNewsListEventProps = {
  data: NewsEvent;
  classNames: string;
  priority?: boolean;
};

export default function NewsListEvent({
  data,
  classNames,
  priority,
}: TNewsListEventProps) {
  const locale = useLocale() as LANG_TYPE;
  const t = useTranslations();
  return (
    <Card
      className={cn(
        classNames,
        "transition-all hover:shadow-lg hover:scale-[1.01]"
      )}
    >
      <CardHeader className="min-h-[60px]">
        <CardTitle className="hover:underline cursor-pointer text-2xl">
          <Link href={`/${locale}/blog/${data.slug}`}>
            {data.title[locale]}
          </Link>
        </CardTitle>
        <CardDescription className="text-md">
          {data.description[locale]}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative w-full aspect-[4/3] rounded overflow-hidden">
        {data.imageUrl && (
          <Image
            src={data.imageUrl}
            alt={data.description[locale]}
            priority={priority}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 25vw"
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between px-3">
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <TagItem key={tag} tag={tag} />
          ))}
        </div>
        <Link
          href={`/${locale}/blog/${data.slug}`}
          className={cn(
            buttonVariants({ variant: "default" }),
            "rounded-full group transform transition-transform duration-300 hover:scale-[1.01] hover:shadow-md"
          )}
        >
          <span className="mr-2">{t("more")}</span>
          <ChevronsRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </CardFooter>
    </Card>
  );
}
