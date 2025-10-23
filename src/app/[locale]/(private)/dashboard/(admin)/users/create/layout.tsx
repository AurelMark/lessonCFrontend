import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Create User", description: "Add a new user account." },
  ro: {
    title: "Creează utilizator",
    description: "Adaugă un cont de utilizator nou.",
  },
  ru: {
    title: "Создать пользователя",
    description: "Добавить новый аккаунт пользователя.",
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
  const url = `${BASE_URL}/${lang}/dashboard/users/create`;

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
        en: `${BASE_URL}/en/dashboard/users/create`,
        ro: `${BASE_URL}/ro/dashboard/users/create`,
        ru: `${BASE_URL}/ru/dashboard/users/create`,
      },
    },
  };
}

export default function UsersCreateLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
