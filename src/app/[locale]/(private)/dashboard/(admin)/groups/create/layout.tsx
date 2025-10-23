// app/[locale]/dashboard/group/create/layout.tsx
import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Create Group", description: "Add a new group." },
  ro: { title: "Creează grup", description: "Adaugă un grup nou." },
  ru: { title: "Создать группу", description: "Добавить новую группу." },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[lang];
  const url = `${BASE_URL}/${lang}/dashboard/group/create`;

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
        en: `${BASE_URL}/en/dashboard/group/create`,
        ro: `${BASE_URL}/ro/dashboard/group/create`,
        ru: `${BASE_URL}/ru/dashboard/group/create`,
      },
    },
  };
}

export default function GroupCreateLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
