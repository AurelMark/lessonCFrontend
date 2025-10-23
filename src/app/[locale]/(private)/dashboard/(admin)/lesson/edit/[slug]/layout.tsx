// app/[locale]/dashboard/lesson/edit/[slug]/layout.tsx
import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Edit Lesson", description: "Edit the selected lesson." },
  ro: { title: "Editează lecția", description: "Editează lecția selectată." },
  ru: {
    title: "Редактировать урок",
    description: "Редактировать выбранный урок.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[lang];
  const url = `${BASE_URL}/${lang}/dashboard/lesson/edit/${slug}`;

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
        en: `${BASE_URL}/en/dashboard/lesson/edit/${slug}`,
        ro: `${BASE_URL}/ro/dashboard/lesson/edit/${slug}`,
        ru: `${BASE_URL}/ru/dashboard/lesson/edit/${slug}`,
      },
    },
  };
}

export default function LessonEditLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
