"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getBlogBySlug } from "@/api/news";
import { useLocale, useTranslations } from "next-intl";
import { LANG_TYPE } from "@/types";
import TagItem from "@/components/custom/TagItem";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/componentsUI/breadcrumb";
import Footer from "@/custom/Footer";

export default function NewsDetailPage() {
  const { slug } = useParams() as { slug: string };
  const locale = useLocale() as LANG_TYPE;
  const t = useTranslations();

  const { data, isLoading, error } = useQuery({
    queryKey: ["news-slug", slug],
    queryFn: () => getBlogBySlug(slug),
    staleTime: 0,
    gcTime: 0,
  });

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="w-full h-[300px]" />
        <Skeleton className="h-4 w-full mt-4" />
      </div>
    );
  }

  if (error || !data) return <div>{t("noCourse")}</div>;

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <Breadcrumb className="m-2 my-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t("home")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/blog">{t("blog")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{data.title[locale]}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <section className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-xl shadow-md mb-6">
          {data.imageUrl && (
            <Image
              src={data.imageUrl}
              alt={data.title[locale]}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-end p-6 justify-center">
            <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">
              {data.title[locale]}
            </h2>
          </div>
        </section>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-4 px-1">
          <div className="text-muted-foreground text-sm">
            {data.description[locale]}
          </div>
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag) => (
              <TagItem key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full px-4 mt-8">
        <div
          className="prose prose-neutral dark:prose-invert max-w-none bg-muted/40 rounded-xl shadow p-6 prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 text-black dark:text-white"
          dangerouslySetInnerHTML={{ __html: data.content[locale] }}
        />
      </div>

      <Footer />
    </>
  );
}
