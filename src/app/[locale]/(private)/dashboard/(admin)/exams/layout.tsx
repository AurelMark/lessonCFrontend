import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: {
    title: "Exams List",
    description: "Browse all available exams and manage them.",
  },
  ro: {
    title: "Lista testelor",
    description: "Vizualizează toate testele disponibile și gestionează-le.",
  },
  ru: {
    title: "Список тестов",
    description: "Просматривайте все доступные тесты и управляйте ими.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[lang];
  const url = `${BASE_URL}/${lang}/dashboard/exam/list`;

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
        en: `${BASE_URL}/en/dashboard/exam/list`,
        ro: `${BASE_URL}/ro/dashboard/exam/list`,
        ru: `${BASE_URL}/ru/dashboard/exam/list`,
      },
    },
  };
}

export default function ExamListLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
