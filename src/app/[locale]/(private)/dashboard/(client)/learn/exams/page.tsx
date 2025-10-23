"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { getExamsByGroups } from "@/api/client";
import CustomPagination from "@/custom/CustomPagination";
import { ContentLoader } from "@/components/DashboardPanel/ContentLoader";
import { ClientExamList } from "@/components/Learn/Exams/ClientExamsList";
import { useExamsStore } from "@/store/useExamsStore";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export default function ExamensListGroups() {
  const t = useTranslations();
  const { page, setPage } = useExamsStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["examsGroups", page],
    queryFn: () => getExamsByGroups(page),
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

  return (
    <ContentLayout title="Exams">
      {data && (
        <div className="flex flex-col gap-4">
          {data.data && <ClientExamList data={data.data} />}
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
