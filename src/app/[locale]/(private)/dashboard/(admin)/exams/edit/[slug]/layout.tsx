import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Edit Exam", description: "Edit the selected exam." },
  ro: { title: "Editează testul", description: "Editează testul selectat." },
  ru: {
    title: "Редактировать тест",
    description: "Редактировать выбранный тест.",
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
  const url = `${BASE_URL}/${lang}/dashboard/exams/edit/${slug}`;

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
        en: `${BASE_URL}/en/dashboard/exams/edit/${slug}`,
        ro: `${BASE_URL}/ro/dashboard/exams/edit/${slug}`,
        ru: `${BASE_URL}/ru/dashboard/exams/edit/${slug}`,
      },
    },
  };
}

export default function ExamsEditLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
