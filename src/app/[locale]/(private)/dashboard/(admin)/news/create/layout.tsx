// layout.tsx
import { ReactNode } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { BASE_URL } from "@/constants";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: {
    title: "News — Latest Updates",
    description: "Read the latest news and updates.",
  },
  ro: {
    title: "Noutăți — Ultimele actualizări",
    description: "Citiți cele mai recente noutăți și actualizări.",
  },
  ru: {
    title: "Новости — Последние обновления",
    description: "Читайте последние новости и обновления.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[lang];
  const url = `${BASE_URL}/${lang}/dashboard/news`;

  return {
    title: content.title,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
      url,
      type: "website",
      images: [`${BASE_URL}/logo.png`],
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_URL}/en/dashboard/news`,
        ro: `${BASE_URL}/ro/dashboard/news`,
        ru: `${BASE_URL}/ru/dashboard/news`,
      },
    },
  };
}

export default function NewsDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
