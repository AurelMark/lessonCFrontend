import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: {
    title: "Frequently Asked Questions",
    description: "Find answers to common questions.",
  },
  ro: {
    title: "Întrebări frecvente",
    description: "Găsește răspunsuri la întrebările frecvente.",
  },
  ru: {
    title: "Часто задаваемые вопросы",
    description: "Найдите ответы на часто задаваемые вопросы.",
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
  const url = `${BASE_URL}/${lang}/faq`;

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
        en: `${BASE_URL}/en/faq`,
        ro: `${BASE_URL}/ro/faq`,
        ru: `${BASE_URL}/ru/faq`,
      },
    },
  };
}

export default function PublicFAQLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
