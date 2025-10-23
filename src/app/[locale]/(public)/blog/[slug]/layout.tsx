import { ReactNode } from "react";
import { getBlogBySlug } from "@/api/news";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { BASE_URL } from "@/constants";
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
  const news = await getBlogBySlug(slug);

  return {
    title: news.title[lang],
    description: news.description[lang],
    openGraph: {
      title: news.title[lang],
      description: news.description[lang],
      images: news.imageUrl ? [news.imageUrl] : [],
    },
    alternates: {
      canonical: `${BASE_URL}/${lang}/blog/${slug}`,
      languages: {
        en: `${BASE_URL}/en/blog/${slug}`,
        ro: `${BASE_URL}/ro/blog/${slug}`,
        ru: `${BASE_URL}/ru/blog/${slug}`,
      },
    },
  };
}

export default function BlogSlugLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
