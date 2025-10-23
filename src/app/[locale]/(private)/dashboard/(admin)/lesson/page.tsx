"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import CustomPagination from "@/custom/CustomPagination";
import { Button } from "@/componentsUI/button";
import { useLessonFilter } from "@/store/useLessonFilter";
import { LANG_TYPE } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getLessonAdmin } from "@/api/lesson";
import { AdminLesson } from "@/components/Admin/Lesson/AdminLesson";
import { ContentLoader } from "@/components/DashboardPanel/ContentLoader";

export default function AdminLessonsPage() {
  const t = useTranslations();
  const { page, setPage } = useLessonFilter();
  const locale = useLocale() as LANG_TYPE;

  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["lesson", page],
    queryFn: () => getLessonAdmin(page),
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
      <ContentLayout title="Lesson">
        <ContentLoader />
      </ContentLayout>
    );
  if (error)
    return (
      <ContentLayout title="Lesson">
        <div>{t("loadError")}</div>
      </ContentLayout>
    );

  const handleToCreateNews = () => {
    router.push(`/${locale}/dashboard/lesson/create`);
  };

  return (
    <ContentLayout title="Lesson">
      <div className="flex justify-end mb-4">
        <Button onClick={handleToCreateNews}>
          {t("dashboard.adminLesson.createLesson")}
        </Button>
      </div>
      {data && (
        <div className="flex flex-col gap-4">
          <AdminLesson data={data.data} />
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
