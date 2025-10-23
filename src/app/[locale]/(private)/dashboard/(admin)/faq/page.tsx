"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getFAQData } from "@/api/faq";
import AdminFAQForm from "@/components/Admin/FAQ/AdminFAQForm";
import { ContentLoader } from "@/components/DashboardPanel/ContentLoader";

export default function AdminHomepage() {
  const t = useTranslations("faq");
  const { data, isLoading, error } = useQuery({
    queryKey: ["faqData"],
    queryFn: () => getFAQData(),
    staleTime: 0,
    gcTime: 0,
  });

  if (isLoading)
    return (
      <ContentLayout title="FAQ">
        <ContentLoader />
      </ContentLayout>
    );

  if (error)
    return (
      <ContentLayout title="FAQ">
        <div>{t("loadError")}</div>
      </ContentLayout>
    );

  return (
    <ContentLayout title="FAQ">
      <div className="flex justify-end mb-4"></div>
      <div className="flex flex-col gap-4 bg-background p-8 rounded-lg">
        {data && <AdminFAQForm data={data} />}
      </div>
    </ContentLayout>
  );
}
