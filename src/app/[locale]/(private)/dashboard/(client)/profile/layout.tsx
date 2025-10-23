import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: {
    title: "User Profile",
    description: "View and edit your personal profile.",
  },
  ro: {
    title: "Profil utilizator",
    description: "Vizualizați și editați profilul dvs. personal.",
  },
  ru: {
    title: "Профиль пользователя",
    description: "Просмотр и редактирование личного профиля.",
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
  const url = `${BASE_URL}/${lang}/dashboard/profile`;

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
        en: `${BASE_URL}/en/dashboard/profile`,
        ro: `${BASE_URL}/ro/dashboard/profile`,
        ru: `${BASE_URL}/ru/dashboard/profile`,
      },
    },
  };
}

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
