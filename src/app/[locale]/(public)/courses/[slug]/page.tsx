"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCourseBySlug } from "@/api/course";
import { useLocale, useTranslations } from "use-intl";
import { LANG_TYPE } from "@/types";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/componentsUI/breadcrumb";
import { CourseFacts } from "@/components/Courses/CourseCardFacts";
import { SubCourseCard } from "@/components/Courses/SubcourseCard";
import { SubCourses } from "@/validation/course";
import { AlertCustom } from "@/custom/AlertCustom";
import Footer from "@/custom/Footer";

export default function CourseDetailPage() {
  const { slug } = useParams() as { slug: string };
  const locale = useLocale() as LANG_TYPE;
  const t = useTranslations();

  const { data, isLoading, error } = useQuery({
    queryKey: ["course-slug", slug],
    queryFn: () => getCourseBySlug(slug),
    staleTime: 0,
    gcTime: 0,
  });

  const features = data && data.course.features;
  const subcourses = data && data.subcourses;

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="w-full h-[300px]" />
        <Skeleton className="h-4 w-full mt-4" />
      </div>
    );
  }

  if (error || !data) return <div>{t("noCourse")}</div>;

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <Breadcrumb className="m-2 my-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t("menu.home")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}/courses`}>
                {t("menu.courses")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{data.course.title[locale]}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <section className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-xl shadow-md mb-6">
          <Image
            src={data.course.imageUrl}
            alt={data.course.title[locale]}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/40 flex items-end p-6 justify-center">
            <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">
              {data.course.title[locale]}
            </h2>
          </div>
        </section>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-4 px-1">
          <div className="text-muted-foreground text-sm">
            {data.course.description[locale]}
          </div>
        </div>
      </div>

      <div className="max-w-4xl px-4 mt-8 mx-auto">
        <div
          className="prose prose-neutral dark:prose-invert max-w-none bg-muted/40 rounded-xl shadow p-6 prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 text-black dark:text-white"
          dangerouslySetInnerHTML={{ __html: data.course.content[locale] }}
        />
      </div>

      {!!data?.course?.alert?.length && (
        <div className="flex flex-col gap-4 my-4">
          {data.course.alert.map((el, idx) => (
            <AlertCustom color={el.color} key={idx} content={el.content} />
          ))}
        </div>
      )}

      {features && <CourseFacts {...features} />}

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-3 mt-5">
        {subcourses?.map((subcourse: SubCourses, idx: number) => (
          <SubCourseCard
            key={`${subcourse.courseSlug}-${idx}`}
            subcourse={subcourse}
          />
        ))}
      </div>

      <Footer />
    </>
  );
}
