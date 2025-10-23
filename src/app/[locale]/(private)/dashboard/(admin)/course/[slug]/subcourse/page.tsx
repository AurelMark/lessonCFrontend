"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { Button } from "@/componentsUI/button";
import { LANG_TYPE } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { getCourseBySlug } from "@/api/course";
import { AdminSubCourse } from "@/components/Admin/Course/AdminSubCourse";
import { ContentLoader } from "@/components/DashboardPanel/ContentLoader";

export default function AdminCoursePage() {
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;
  const { slug } = useParams() as { slug: string };

  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["courseBySlug", slug],
    queryFn: () => getCourseBySlug(slug),
    staleTime: 0,
    gcTime: 0,
  });

  if (isLoading)
    return (
      <ContentLayout title="Subcourse">
        <ContentLoader />
      </ContentLayout>
    );
  if (error)
    return (
      <ContentLayout title="Subcourse">
        <div>{t("loadError")}</div>
      </ContentLayout>
    );

  const handleToCreateNews = () => {
    router.push(`/${locale}/dashboard/course/${slug}/subcourse/create`);
  };

  return (
    <ContentLayout title="Subcourse">
      <div className="flex justify-end mb-4">
        <Button onClick={handleToCreateNews}>
          {t("dashboard.adminSubcourse.createSubcourse")}
        </Button>
      </div>
      {data && (
        <div className="flex flex-col gap-4">
          <AdminSubCourse data={data.subcourses} />
        </div>
      )}
    </ContentLayout>
  );
}
