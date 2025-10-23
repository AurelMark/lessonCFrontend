// app/[locale]/dashboard/course/edit/[slug]/layout.tsx
import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Edit Course", description: "Edit the selected course." },
  ro: { title: "Editează cursul", description: "Editează cursul selectat." },
  ru: {
    title: "Редактировать курс",
    description: "Редактировать выбранный курс.",
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
  const url = `${BASE_URL}/${lang}/dashboard/course/edit/${slug}`;

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
        en: `${BASE_URL}/en/dashboard/course/edit/${slug}`,
        ro: `${BASE_URL}/ro/dashboard/course/edit/${slug}`,
        ru: `${BASE_URL}/ru/dashboard/course/edit/${slug}`,
      },
    },
  };
}

export default function CourseEditLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
