"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { getGroups } from "@/api/groups";
import { AdminGroupList } from "@/components/Admin/Group/AdminGroupList";
import CustomPagination from "@/custom/CustomPagination";
import { ContentLoader } from "@/components/DashboardPanel/ContentLoader";
import { Button } from "@/componentsUI/button";
import { useGroupsFilter } from "@/store/useGroupsFilter";
import { LANG_TYPE } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function AdminGroupsPage() {
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;
  const setPage = useGroupsFilter((state) => state.setPage);
  const page = useGroupsFilter((state) => state.page);
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["groups", page],
    queryFn: () => getGroups(page),
    staleTime: 0,
    gcTime: 0,
  });

  if (isLoading)
    return (
      <ContentLayout title="Groups">
        <ContentLoader />
      </ContentLayout>
    );
  if (error)
    return (
      <ContentLayout title="Groups">
        <div>{t("loadError")}</div>
      </ContentLayout>
    );

  const handleRedirectToCreate = () => {
    router.push(`/${locale}/dashboard/groups/create`);
  };

  return (
    <ContentLayout title="Groups">
      {data && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button onClick={handleRedirectToCreate}>{t('dashboard.adminGroups.createGroup')}</Button>
          </div>
          <AdminGroupList data={data.data} />
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
