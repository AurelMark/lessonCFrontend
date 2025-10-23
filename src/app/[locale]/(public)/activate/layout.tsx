import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Activate Account", description: "Activate your user account." },
  ro: {
    title: "Activează contul",
    description: "Activează contul de utilizator.",
  },
  ru: {
    title: "Активация аккаунта",
    description: "Активируйте свой аккаунт пользователя.",
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
  const url = `${BASE_URL}/${lang}/activate`;

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
        en: `${BASE_URL}/en/activate`,
        ro: `${BASE_URL}/ro/activate`,
        ru: `${BASE_URL}/ru/activate`,
      },
    },
  };
}

export default function ActivateAccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
