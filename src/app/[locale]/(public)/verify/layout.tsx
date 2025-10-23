import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: {
    title: "Verify Account",
    description: "Confirm and verify your account to start using all features.",
  },
  ro: {
    title: "Verifică contul",
    description:
      "Confirmați și verificați contul pentru a accesa toate funcționalitățile.",
  },
  ru: {
    title: "Проверка аккаунта",
    description:
      "Подтвердите и проверьте аккаунт для использования всех функций.",
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
  const url = `${BASE_URL}/${lang}/verify`;

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
        en: `${BASE_URL}/en/verify`,
        ro: `${BASE_URL}/ro/verify`,
        ru: `${BASE_URL}/ru/verify`,
      },
    },
  };
}

export default function VerifyAccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
