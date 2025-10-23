import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Users List", description: "Browse and manage users." },
  ro: {
    title: "Lista utilizatorilor",
    description: "Vizualizați și gestionați utilizatorii.",
  },
  ru: {
    title: "Список пользователей",
    description: "Просмотр и управление пользователями.",
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
  const url = `${BASE_URL}/${lang}/dashboard/users`;

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
        en: `${BASE_URL}/en/dashboard/users`,
        ro: `${BASE_URL}/ro/dashboard/users`,
        ru: `${BASE_URL}/ru/dashboard/users`,
      },
    },
  };
}

export default function UsersListLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
