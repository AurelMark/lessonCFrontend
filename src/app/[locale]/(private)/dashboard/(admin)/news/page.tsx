"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { getNewsAdmin } from "@/api/news";
import { AdminNews } from "@/components/Admin/News/AdminNews";
import CustomPagination from "@/custom/CustomPagination";
import { ContentLoader } from "@/components/DashboardPanel/ContentLoader";
import { Button } from "@/componentsUI/button";
import { useTagNewsFilter } from "@/store/useTagNewsFilter";
import { LANG_TYPE } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminNewsPage() {
  const t = useTranslations();
  const { selectedTag, page, setPage } = useTagNewsFilter();
  const locale = useLocale() as LANG_TYPE;

  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["news", selectedTag, page],
    queryFn: () => getNewsAdmin(selectedTag, page),
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (!isLoading && data && data.data && data.data.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [isLoading, data, page, setPage]);

  if (isLoading)
    return (
      <ContentLayout title="News">
        <ContentLoader />
      </ContentLayout>
    );
  if (error)
    return (
      <ContentLayout title="News">
        <div>{t("loadError")}</div>
      </ContentLayout>
    );

  const handleToCreateNews = () => {
    router.push(`/${locale}/dashboard/news/create`);
  };

  return (
    <ContentLayout title="News">
      <div className="flex justify-end mb-4">
        <Button onClick={handleToCreateNews}>
          {t("dashboard.createNews")}
        </Button>
      </div>
      {data && (
        <div className="flex flex-col gap-4">
          <AdminNews data={data} />
          <CustomPagination
            currentPage={data.currentPage}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </ContentLayout>
  );
}
