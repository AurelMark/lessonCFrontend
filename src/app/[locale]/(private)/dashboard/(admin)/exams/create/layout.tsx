import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Create Exam", description: "Create a new exam." },
  ro: { title: "Creează test", description: "Creează un test nou." },
  ru: { title: "Создать тест", description: "Создать новый тест." },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[lang];
  const url = `${BASE_URL}/${lang}/dashboard/exams/create`;

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
        en: `${BASE_URL}/en/dashboard/exams/create`,
        ro: `${BASE_URL}/ro/dashboard/exams/create`,
        ru: `${BASE_URL}/ru/dashboard/exams/create`,
      },
    },
  };
}

export default function ExamsCreateLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
