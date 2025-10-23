import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Edit User", description: "Edit the selected user's profile." },
  ro: {
    title: "Editează utilizatorul",
    description: "Editează profilul utilizatorului selectat.",
  },
  ru: {
    title: "Редактировать пользователя",
    description: "Редактировать профиль выбранного пользователя.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale, userId } = await params;
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[lang];
  const url = `${BASE_URL}/${lang}/dashboard/users/edit/${userId}`;

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
        en: `${BASE_URL}/en/dashboard/users/edit/${userId}`,
        ro: `${BASE_URL}/ro/dashboard/users/edit/${userId}`,
        ru: `${BASE_URL}/ru/dashboard/users/edit/${userId}`,
      },
    },
  };
}

export default function UsersEditLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
