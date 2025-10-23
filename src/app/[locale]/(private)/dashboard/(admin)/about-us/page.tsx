"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getAboutUsData } from "@/api/aboutUs";
import AboutUsForm from "@/components/Admin/AboutUs/AboutUsForm";
import { ContentLoader } from "@/components/DashboardPanel/ContentLoader";

export default function AdminAboutUsPage() {
  const t = useTranslations("homepage.aboutUs");
  const { data, isLoading, error } = useQuery({
    queryKey: ["getAboutUsData"],
    queryFn: () => getAboutUsData(),
    staleTime: 0,
    gcTime: 0,
  });

  if (isLoading)
    return (
      <ContentLayout title="About Us">
        <ContentLoader />
      </ContentLayout>
    );

  if (error)
    return (
      <ContentLayout title="About Us">
        <div>{t("loadError")}</div>
      </ContentLayout>
    );

  return (
    <ContentLayout title="About Us">
      <div className="flex flex-col gap-4 bg-background p-8 rounded-lg">
        {data && <AboutUsForm data={data} />}
      </div>
    </ContentLayout>
  );
}
