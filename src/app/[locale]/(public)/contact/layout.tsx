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
    title: "Contact Us — Get in Touch",
    description: "Reach out to us for any questions or support.",
  },
  ro: {
    title: "Contactați-ne — Luați legătura cu noi",
    description: "Contactați-ne pentru orice întrebări sau asistență.",
  },
  ru: {
    title: "Связаться с нами — Напишите нам",
    description: "Свяжитесь с нами по любым вопросам или для поддержки.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[lang];

  return {
    title: content.title,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
      url: `${BASE_URL}/${lang}/contact`,
      type: "website",
      images: [`${BASE_URL}/logo.png`],
    },
    alternates: {
      canonical: `${BASE_URL}/${lang}/contact`,
      languages: {
        en: `${BASE_URL}/en/contact`,
        ro: `${BASE_URL}/ro/contact`,
        ru: `${BASE_URL}/ru/contact`,
      },
    },
  };
}

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
