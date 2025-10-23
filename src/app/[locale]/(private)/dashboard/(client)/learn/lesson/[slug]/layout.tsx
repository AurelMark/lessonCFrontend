import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: {
    title: "Lesson details",
    description: "Details for the selected lesson.",
  },
  ro: {
    title: "Detalii lecție",
    description: "Detalii pentru lecția selectată.",
  },
  ru: {
    title: "Детали урока",
    description: "Детальная информация по выбранному уроку.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[lang];
  const url = `${BASE_URL}/${lang}/lessons/${id}`;

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
        en: `${BASE_URL}/en/lessons/${id}`,
        ro: `${BASE_URL}/ro/lessons/${id}`,
        ru: `${BASE_URL}/ru/lessons/${id}`,
      },
    },
  };
}

export default function LessonDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
