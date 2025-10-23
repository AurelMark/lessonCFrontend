// app/[locale]/dashboard/lesson/create/layout.tsx
import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Create Lesson", description: "Create a new lesson." },
  ro: { title: "Creează lecție", description: "Creează o lecție nouă." },
  ru: { title: "Создать урок", description: "Создать новый урок." },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[lang];
  const url = `${BASE_URL}/${lang}/dashboard/lesson/create`;

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
        en: `${BASE_URL}/en/dashboard/lesson/create`,
        ro: `${BASE_URL}/ro/dashboard/lesson/create`,
        ru: `${BASE_URL}/ru/dashboard/lesson/create`,
      },
    },
  };
}

export default function LessonCreateLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
