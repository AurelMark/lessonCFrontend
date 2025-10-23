"use client";

import { getNews } from "@/api/news";
import CustomPagination from "@/custom/CustomPagination";
import NewsList from "@/components/News/NewsList";
import { useSyncPageWithUrl } from "@/hooks/useSyncPageWithUrl";
import { useTagBlogFilter } from "@/store/useTagBlogFilter";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import NewsListSkeleton from "@/components/News/NewsListSkeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/componentsUI/breadcrumb";
import Footer from "@/custom/Footer";

export default function HomePage() {
  const t = useTranslations();
  useSyncPageWithUrl("blog");
  const { selectedTag, page, setPage } = useTagBlogFilter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["news", selectedTag, page],
    queryFn: () => getNews(selectedTag, page),
    staleTime: 0,
    gcTime: 0,
  });

  if (isLoading) return <NewsListSkeleton />;
  if (error) return <div>{t("loadError")}</div>;

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
          </BreadcrumbList>
        </Breadcrumb>
        {data && data.data.length > 0 ? (
          <div className="flex flex-col gap-y-5">
            <NewsList data={data.data} />
            <CustomPagination
              currentPage={data.currentPage}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </div>
        ) : (
          <div>{t("noNews")}</div>
        )}
      </div>
      <Footer />
    </>
  );
}
