// app/[locale]/dashboard/group/layout.tsx
import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Group List", description: "View all groups." },
  ro: { title: "Lista grupurilor", description: "Vezi toate grupurile." },
  ru: { title: "Список групп", description: "Посмотреть все группы." },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[lang];
  const url = `${BASE_URL}/${lang}/dashboard/group`;

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
        en: `${BASE_URL}/en/dashboard/group`,
        ro: `${BASE_URL}/ro/dashboard/group`,
        ru: `${BASE_URL}/ru/dashboard/group`,
      },
    },
  };
}

export default function GroupListLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
