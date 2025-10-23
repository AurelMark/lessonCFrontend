"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { getExamsBySlug } from "@/api/client";
import { ClientExamsCard } from "@/components/Learn/Exams/ClientExamsCard";
import { ContentLoader } from "@/components/DashboardPanel/ContentLoader";

export default function AdminLessonEditPage() {
  const t = useTranslations();
  const { slug } = useParams() as { slug: string };

  const { data, isLoading, error } = useQuery({
    queryKey: ["examsBySlug", slug],
    queryFn: () => getExamsBySlug(slug),
    staleTime: 0,
    gcTime: 0,
  });

  console.log('data', data)

  if (isLoading)
    return (
      <ContentLayout title={"Exams"} key={slug}>
        <ContentLoader />
      </ContentLayout>
    );
  if (error)
    return (
      <ContentLayout title={"Exams"} key={slug}>
        <div>{t("loadError")}</div>
      </ContentLayout>
    );

  if (!data)
    return (
      <ContentLayout title={"Exams"} key={slug}>
        <div className="text-muted-foreground text-center py-12">
          {t("lesson.notFound")}
        </div>
      </ContentLayout>
    );

  return (
    <ContentLayout title={"Exams"} key={slug}>
      <ClientExamsCard data={data} />
    </ContentLayout>
  );
}
