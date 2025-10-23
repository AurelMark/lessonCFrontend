import { ReactNode } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { BASE_URL } from "@/constants";
import { PARAMS_PROMISE } from "@/types";

type Props = {
  children: ReactNode;
  params: PARAMS_PROMISE;
};

const messages = {
  en: {
    title: "Blog — Latest News",
    description: "Explore our latest articles, announcements, and insights.",
  },
  ro: {
    title: "Blog — Știri recente",
    description: "Descoperă cele mai recente articole, anunțuri și informații.",
  },
  ru: {
    title: "Блог — Последние новости",
    description: "Читайте последние статьи, анонсы и полезные материалы.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[locale];

  return {
    title: content.title,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
      url: `${BASE_URL}/${lang}/blog`,
      type: "website",
      images: [`${BASE_URL}/logo.png`],
    },
    alternates: {
      canonical: `${BASE_URL}/${lang}/blog`,
      languages: {
        en: `${BASE_URL}/en/blog`,
        ro: `${BASE_URL}/ro/blog`,
        ru: `${BASE_URL}/ru/blog`,
      },
    },
  };
}

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
