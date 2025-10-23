// app/[locale]/dashboard/attempts/layout.tsx или attempts/page.tsx

import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Attempts", description: "View all exam attempts." },
  ro: { title: "Încercări", description: "Vezi toate încercările la examene." },
  ru: { title: "Попытки", description: "Посмотреть все попытки экзаменов." },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[lang];
  const url = `${BASE_URL}/${lang}/dashboard/attempts`;

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
        en: `${BASE_URL}/en/dashboard/attempts`,
        ro: `${BASE_URL}/ro/dashboard/attempts`,
        ru: `${BASE_URL}/ru/dashboard/attempts`,
      },
    },
  };
}

export default function AttemptsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
