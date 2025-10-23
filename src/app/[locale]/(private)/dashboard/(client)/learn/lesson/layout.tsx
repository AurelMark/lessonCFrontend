import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Lesson List", description: "View all lessons." },
  ro: { title: "Lista lecțiilor", description: "Vezi toate lecțiile." },
  ru: { title: "Список уроков", description: "Посмотреть все уроки." },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[lang];
  const url = `${BASE_URL}/${lang}/lessons`;

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
        en: `${BASE_URL}/en/lessons`,
        ro: `${BASE_URL}/ro/lessons`,
        ru: `${BASE_URL}/ru/lessons`,
      },
    },
  };
}

export default function LessonsListLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
