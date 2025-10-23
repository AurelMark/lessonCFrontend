import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Contacts", description: "Manage incoming contact messages." },
  ro: {
    title: "Contacte",
    description: "Gestionează mesajele primite de contact.",
  },
  ru: {
    title: "Контакты",
    description: "Управляйте входящими сообщениями обратной связи.",
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
  const url = `${BASE_URL}/${lang}/dashboard/contact`;

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
        en: `${BASE_URL}/en/dashboard/contact`,
        ro: `${BASE_URL}/ro/dashboard/contact`,
        ru: `${BASE_URL}/ru/dashboard/contact`,
      },
    },
  };
}

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
