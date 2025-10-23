"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import CustomPagination from "@/custom/CustomPagination";
import { useLessonFilter } from "@/store/useLessonFilter";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { getLessonsByGroups } from "@/api/client";
import { ClientLessonList } from "@/components/Learn/Lesson/ClientLessonList";
import { ContentLoader } from "@/components/DashboardPanel/ContentLoader";

export default function ClientLessonsPage() {
  const t = useTranslations();
  const { page, setPage } = useLessonFilter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["lessonGroup", page],
    queryFn: () => getLessonsByGroups(page),
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

  return (
    <ContentLayout title="Lesson">
      {data && (
        <div className="flex flex-col gap-4">
          <ClientLessonList data={data.data} />
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
