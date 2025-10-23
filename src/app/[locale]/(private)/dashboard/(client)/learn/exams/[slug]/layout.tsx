import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Exam details", description: "Details for the selected exam." },
  ro: {
    title: "Detalii examen",
    description: "Detalii pentru examenul selectat.",
  },
  ru: {
    title: "Детали экзамена",
    description: "Детальная информация по выбранному экзамену.",
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
  const url = `${BASE_URL}/${lang}/exams/${id}`;

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
        en: `${BASE_URL}/en/exams/${id}`,
        ro: `${BASE_URL}/ro/exams/${id}`,
        ru: `${BASE_URL}/ru/exams/${id}`,
      },
    },
  };
}

export default function ExamDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
