"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { getLessonBySlugClient } from "@/api/client";
import { LessonInfoCard } from "@/components/Learn/Lesson/ClientLessonCardInfo";
import { ContentLoader } from "@/components/DashboardPanel/ContentLoader";

export default function AdminLessonEditPage() {
  const t = useTranslations();
  const { slug } = useParams() as { slug: string };

  const { data, isLoading, error } = useQuery({
    queryKey: ["lessonBySlug", slug],
    queryFn: () => getLessonBySlugClient(slug),
    staleTime: 0,
    gcTime: 0,
  });

  if (isLoading)
    return (
      <ContentLayout title={"Lesson"} key={slug}>
        <ContentLoader />
      </ContentLayout>
    );
  if (error)
    return (
      <ContentLayout title={"Lesson"} key={slug}>
        <div>{t("loadError")}</div>
      </ContentLayout>
    );

  if (!data)
    return (
      <ContentLayout title={"Lesson"} key={slug}>
        <div className="text-muted-foreground text-center py-12">
          {t("lesson.notFound")}
        </div>
      </ContentLayout>
    );

  return (
    <ContentLayout title={"Lesson"} key={slug}>
      <LessonInfoCard lesson={data} />
    </ContentLayout>
  );
}
