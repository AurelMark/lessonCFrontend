// app/[locale]/dashboard/layout.tsx

import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Dashboard", description: "Manage your personal account." },
  ro: {
    title: "Panou de control",
    description: "Gestionați contul dvs. personal.",
  },
  ru: {
    title: "Панель управления",
    description: "Управляйте своим аккаунтом.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[lang];
  const url = `${BASE_URL}/${lang}/dashboard`;

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
        en: `${BASE_URL}/en/dashboard`,
        ro: `${BASE_URL}/ro/dashboard`,
        ru: `${BASE_URL}/ru/dashboard`,
      },
    },
  };
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
