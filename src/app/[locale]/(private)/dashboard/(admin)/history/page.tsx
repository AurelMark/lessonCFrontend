"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { getHistoryLogs } from "@/api/history";
import AdminHistoryLogs from "@/components/Admin/HistoryLogs/AdminHistoryLogs";
import CustomPagination from "@/custom/CustomPagination";
import { ContentLoader } from "@/components/DashboardPanel/ContentLoader";
import { useHistoryLogsStore } from "@/store/useHistoryLogsStore";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export default function AdminGroupsPage() {
  const t = useTranslations();
  const { page, setPage } = useHistoryLogsStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["historyStats", page],
    queryFn: () => getHistoryLogs(page),
    staleTime: 0,
    gcTime: 0,
  });

  if (isLoading)
    return (
      <ContentLayout title="History Action">
        <ContentLoader />
      </ContentLayout>
    );

  if (error)
    return (
      <ContentLayout title="History Action">
        <div>{t("loadError")}</div>
      </ContentLayout>
    );

  return (
    <ContentLayout title="History Action">
      {data && (
        <div className="flex flex-col gap-4">
          <AdminHistoryLogs data={data.data} />
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
