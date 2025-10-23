"use client";

import CustomPagination from "@/custom/CustomPagination";
import { useSyncPageWithUrl } from "@/hooks/useSyncPageWithUrl";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/componentsUI/breadcrumb";
import { getCourse } from "@/api/course";
import { CourseCard } from "@/components/Courses/CoursesCard";
import { CourseEvent } from "@/validation/course";
import { CourseCardSkeleton } from "@/components/Courses/CourseCardSkeleton";
import { useCourseFilter } from "@/store/useCourseFilter";
import Footer from "@/custom/Footer";

export default function HomePage() {
  const t = useTranslations();
  useSyncPageWithUrl("courses");
  const { page, setPage } = useCourseFilter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["course", page],
    queryFn: () => getCourse(page),
    staleTime: 0,
    gcTime: 0,
  });

  if (isLoading) return <CourseCardSkeleton />;
  if (error) return <div>{t("loadError")}</div>;

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <Breadcrumb className="m-2 my-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t("home")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/courses">
                {t("menu.courses")}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {data && data.data.length > 0 ? (
          <div className="max-w-7xl mx-auto p-4">
            <div className="flex flex-col gap-y-5">
              {data.data.map((course: CourseEvent, idx: number) => (
                <CourseCard key={course.slug} course={course} idx={idx} />
              ))}
              <CustomPagination
                currentPage={data.currentPage}
                totalPages={data.totalPages}
                onPageChange={setPage}
              />
            </div>
          </div>
        ) : (
          <div>{t("noCourse")}</div>
        )}
      </div>
      <Footer />
    </>
  );
}
