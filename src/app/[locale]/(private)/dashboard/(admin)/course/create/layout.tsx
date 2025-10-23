// app/[locale]/dashboard/course/create/layout.tsx
import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Create Course", description: "Add a new course." },
  ro: { title: "Creează curs", description: "Adaugă un curs nou." },
  ru: { title: "Создать курс", description: "Добавить новый курс." },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[lang];
  const url = `${BASE_URL}/${lang}/dashboard/course/create`;

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
        en: `${BASE_URL}/en/dashboard/course/create`,
        ro: `${BASE_URL}/ro/dashboard/course/create`,
        ru: `${BASE_URL}/ru/dashboard/course/create`,
      },
    },
  };
}

export default function CourseCreateLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
