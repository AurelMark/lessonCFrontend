// app/[locale]/dashboard/home/layout.tsx или home/page.tsx (admin panel)

import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Admin Dashboard", description: "Main admin panel page." },
  ro: {
    title: "Panou de administrare",
    description: "Pagina principală a panoului de administrare.",
  },
  ru: { title: "Админ-панель", description: "Главная страница админ-панели." },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[lang];
  const url = `${BASE_URL}/${lang}/dashboard/home`;

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
        en: `${BASE_URL}/en/dashboard/home`,
        ro: `${BASE_URL}/ro/dashboard/home`,
        ru: `${BASE_URL}/ru/dashboard/home`,
      },
    },
  };
}

export default function HomeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
