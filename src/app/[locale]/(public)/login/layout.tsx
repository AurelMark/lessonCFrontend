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
    title: "Login — Access Your Account",
    description: "Log in to your account to access all features.",
  },
  ro: {
    title: "Autentificare — Accesează contul",
    description: "Autentifică-te pentru a avea acces la toate funcțiile.",
  },
  ru: {
    title: "Вход — Доступ к аккаунту",
    description: "Войдите в свой аккаунт для доступа ко всем возможностям.",
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
      url: `${BASE_URL}/${lang}/login`,
      type: "website",
      images: [`${BASE_URL}/logo.png`],
    },
    alternates: {
      canonical: `${BASE_URL}/${lang}/login`,
      languages: {
        en: `${BASE_URL}/en/login`,
        ro: `${BASE_URL}/ro/login`,
        ru: `${BASE_URL}/ru/login`,
      },
    },
  };
}

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
