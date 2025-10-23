import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Account Recovery", description: "Recover your user account." },
  ro: {
    title: "Recuperare cont",
    description: "Recuperați contul de utilizator.",
  },
  ru: {
    title: "Восстановление аккаунта",
    description: "Восстановите свой аккаунт пользователя.",
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
  const url = `${BASE_URL}/${lang}/reset`;

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
        en: `${BASE_URL}/en/recover/success`,
        ro: `${BASE_URL}/ro/recover/success`,
        ru: `${BASE_URL}/ru/recover/success`,
      },
    },
  };
}

export default function AccountRecoveryLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
