import { ReactNode } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { BASE_URL } from "@/constants";
import { getCourseBySlug } from "@/api/course";
import { PARAMS_PROMISE } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const lang = locale as "ro" | "ru" | "en";
  if (!slug) {
    throw new Error("Slug is required");
  }
  const news = await getCourseBySlug(slug);

  return {
    title: news.course.title[lang],
    description: news.course.description[lang],
    openGraph: {
      title: news.course.title[lang],
      description: news.course.description[lang],
      images: [news.course.imageUrl],
    },
    alternates: {
      canonical: `${BASE_URL}/${lang}/course/${slug}`,
      languages: {
        en: `${BASE_URL}/en/course/${slug}`,
        ro: `${BASE_URL}/ro/course/${slug}`,
        ru: `${BASE_URL}/ru/course/${slug}`,
      },
    },
  };
}

export default function CourseSlugLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
