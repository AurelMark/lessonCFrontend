"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { getExams } from "@/api/exams";
import { AdminExamsList } from "@/components/Admin/Exams/AdminExamsList";
import CustomPagination from "@/custom/CustomPagination";
import { ContentLoader } from "@/components/DashboardPanel/ContentLoader";
import { Button } from "@/componentsUI/button";
import { useExamsStore } from "@/store/useExamsStore";
import { LANG_TYPE } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function AdminExamsPage() {
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;
  const { page, setPage } = useExamsStore();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["exams", page],
    queryFn: () => getExams(page),
    staleTime: 0,
    gcTime: 0,
  });

  if (isLoading)
    return (
      <ContentLayout title="Exams">
        <ContentLoader />
      </ContentLayout>
    );
  if (error)
    return (
      <ContentLayout title="Exams">
        <div>{t("loadError")}</div>
      </ContentLayout>
    );

  const handleRedirectToCreate = () => {
    router.push(`/${locale}/dashboard/exams/create`);
  };

  return (
    <ContentLayout title="Exams">
      {data && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button onClick={handleRedirectToCreate}>
              {t("dashboard.adminExams.createExam")}
            </Button>
          </div>
          <AdminExamsList data={data.data} />
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
