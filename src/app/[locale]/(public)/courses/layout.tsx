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
    title: "Courses — Improve Your Skills",
    description: "Browse our selection of courses and start learning today.",
  },
  ro: {
    title: "Cursuri — Îmbunătățește-ți abilitățile",
    description:
      "Descoperă selecția noastră de cursuri și începe să înveți chiar azi.",
  },
  ru: {
    title: "Курсы — Прокачай свои навыки",
    description: "Просмотрите наши курсы и начните обучение уже сегодня.",
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
      url: `${BASE_URL}/${lang}/courses`,
      type: "website",
      images: [`${BASE_URL}/logo.png`],
    },
    alternates: {
      canonical: `${BASE_URL}/${lang}/courses`,
      languages: {
        en: `${BASE_URL}/en/courses`,
        ro: `${BASE_URL}/ro/courses`,
        ru: `${BASE_URL}/ru/courses`,
      },
    },
  };
}

export default function CoursesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
