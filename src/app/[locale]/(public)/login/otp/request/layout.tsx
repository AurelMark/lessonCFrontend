import { ReactNode } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { BASE_URL } from "@/constants";
import { PARAMS_PROMISE } from "@/types";

type Props = {
  children: ReactNode;
  params: PARAMS_PROMISE;
};

const messages = {
  en: {
    title: "OTP Request — Login by Code",
    description: "Request a one-time code to log in without a password.",
  },
  ro: {
    title: "Cerere OTP — Autentificare cu cod",
    description: "Solicită un cod unic pentru a te autentifica fără parolă.",
  },
  ru: {
    title: "Запрос OTP — Вход по коду",
    description: "Запросите одноразовый код для входа без пароля.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[locale];

  return {
    title: content.title,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
      url: `${BASE_URL}/${lang}/login/otp/request`,
      type: "website",
      images: [`${BASE_URL}/logo.png`],
    },
    alternates: {
      canonical: `${BASE_URL}/${lang}/login/otp/request`,
      languages: {
        en: `${BASE_URL}/en/login/otp/request`,
        ro: `${BASE_URL}/ro/login/otp/request`,
        ru: `${BASE_URL}/ru/login/otp/request`,
      },
    },
  };
}

export default function LoginOTPRequestLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
