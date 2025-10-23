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
    title: "Enter OTP Code",
    description: "Enter the code sent to your email to continue.",
  },
  ro: {
    title: "Introduceți codul OTP",
    description: "Introduceți codul trimis pe email pentru a continua.",
  },
  ru: {
    title: "Введите OTP код",
    description: "Введите код, отправленный вам на почту, чтобы продолжить.",
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
      url: `${BASE_URL}/${lang}/login/otp/code`,
      type: "website",
      images: [`${BASE_URL}/logo.png`],
    },
    alternates: {
      canonical: `${BASE_URL}/${lang}/login/otp/code`,
      languages: {
        en: `${BASE_URL}/en/login/otp/code`,
        ro: `${BASE_URL}/ro/login/otp/code`,
        ru: `${BASE_URL}/ru/login/otp/code`,
      },
    },
  };
}

export default function LoginOTPCodeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
