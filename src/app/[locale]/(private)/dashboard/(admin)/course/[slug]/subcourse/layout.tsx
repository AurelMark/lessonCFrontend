// app/[locale]/dashboard/subcourse/layout.tsx
import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Subcourses", description: "Browse all subcourses." },
  ro: { title: "Subcursuri", description: "Vezi toate subcursurile." },
  ru: { title: "Субкурсы", description: "Просмотр всех субкурсов." },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[lang];
  const url = `${BASE_URL}/${lang}/dashboard/subcourse`;

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
        en: `${BASE_URL}/en/dashboard/subcourse`,
        ro: `${BASE_URL}/ro/dashboard/subcourse`,
        ru: `${BASE_URL}/ru/dashboard/subcourse`,
      },
    },
  };
}

export default function SubcourseListLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
