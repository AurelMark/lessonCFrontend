// app/[locale]/dashboard/subcourse/create/layout.tsx
import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Create Subcourse", description: "Add a new subcourse." },
  ro: { title: "Creează subcurs", description: "Adaugă un subcurs nou." },
  ru: { title: "Создать субкурс", description: "Добавить новый субкурс." },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[lang];
  const url = `${BASE_URL}/${lang}/dashboard/subcourse/create`;

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
        en: `${BASE_URL}/en/dashboard/subcourse/create`,
        ro: `${BASE_URL}/ro/dashboard/subcourse/create`,
        ru: `${BASE_URL}/ru/dashboard/subcourse/create`,
      },
    },
  };
}

export default function SubcourseCreateLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
