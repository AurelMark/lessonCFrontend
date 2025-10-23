// app/[locale]/dashboard/news/layout.tsx
import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "News List", description: "View all news articles." },
  ro: { title: "Lista noutăților", description: "Vezi toate noutățile." },
  ru: { title: "Список новостей", description: "Посмотреть все новости." },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale } = await params;
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

export default function NewsListLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
