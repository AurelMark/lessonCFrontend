import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Exam List", description: "Available exams for you." },
  ro: {
    title: "Lista examenelor",
    description: "Examene disponibile pentru dvs.",
  },
  ru: { title: "Список экзаменов", description: "Доступные экзамены для вас." },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[lang];
  const url = `${BASE_URL}/${lang}/exams`;

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
        en: `${BASE_URL}/en/exams`,
        ro: `${BASE_URL}/ro/exams`,
        ru: `${BASE_URL}/ru/exams`,
      },
    },
  };
}

export default function ExamsListLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
