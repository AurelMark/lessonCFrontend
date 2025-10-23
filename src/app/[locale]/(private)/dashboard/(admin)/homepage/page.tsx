"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getHomepageData } from "@/api/homepage";
import AdminHomepageForm from "@/components/Admin/Homepage/AdminHomepageForm";
import { ContentLoader } from "@/components/DashboardPanel/ContentLoader";

export default function AdminHomepage() {
  const t = useTranslations("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["getHomepageData"],
    queryFn: () => getHomepageData(),
    staleTime: 0,
    gcTime: 0,
  });

  if (isLoading)
    return (
      <ContentLayout title="Homepage">
        <ContentLoader />
      </ContentLayout>
    );

  if (error)
    return (
      <ContentLayout title="Homepage">
        <div>{t("loadError")}</div>
      </ContentLayout>
    );

  return (
    <ContentLayout title="Homepage">
      <div className="flex justify-end mb-4"></div>
      <div className="flex flex-col gap-4">
        {data && <AdminHomepageForm data={data} />}
      </div>
    </ContentLayout>
  );
}
