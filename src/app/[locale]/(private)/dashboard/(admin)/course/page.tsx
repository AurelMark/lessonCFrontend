"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import CustomPagination from "@/custom/CustomPagination";
import { Button } from "@/componentsUI/button";
import { LANG_TYPE } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCourseFilter } from "@/store/useCourseFilter";
import { getCourse } from "@/api/course";
import { AdminCourse } from "@/components/Admin/Course/AdminCourse";
import { ContentLoader } from "@/components/DashboardPanel/ContentLoader";

export default function AdminCoursePage() {
  const t = useTranslations();
  const { page, setPage } = useCourseFilter();
  const locale = useLocale() as LANG_TYPE;

  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["course", page],
    queryFn: () => getCourse(page),
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
      <ContentLayout title="Course">
        <ContentLoader />
      </ContentLayout>
    );
  if (error)
    return (
      <ContentLayout title="Course">
        <div>{t("loadError")}</div>
      </ContentLayout>
    );

  const handleToCreateNews = () => {
    router.push(`/${locale}/dashboard/course/create`);
  };

  return (
    <ContentLayout title="Course">
      <div className="flex justify-end mb-4">
        <Button onClick={handleToCreateNews}>
          {t("dashboard.adminCourse.createCourse")}
        </Button>
      </div>
      {data && (
        <div className="flex flex-col gap-4">
          <AdminCourse data={data.data} />
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
