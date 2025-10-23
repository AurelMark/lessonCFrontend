// app/[locale]/dashboard/course/layout.tsx
import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Courses", description: "Browse all courses." },
  ro: { title: "Cursuri", description: "Vezi toate cursurile." },
  ru: { title: "Курсы", description: "Просмотр всех курсов." },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[lang];
  const url = `${BASE_URL}/${lang}/dashboard/course`;

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
        en: `${BASE_URL}/en/dashboard/course`,
        ro: `${BASE_URL}/ro/dashboard/course`,
        ru: `${BASE_URL}/ru/dashboard/course`,
      },
    },
  };
}

export default function CourseListLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
