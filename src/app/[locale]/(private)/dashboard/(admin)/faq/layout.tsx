import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "FAQ Management", description: "Edit and manage FAQs." },
  ro: {
    title: "Administrarea FAQ",
    description: "Editează și gestionează întrebările frecvente.",
  },
  ru: {
    title: "Управление FAQ",
    description: "Редактируйте и управляйте часто задаваемыми вопросами.",
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
  const url = `${BASE_URL}/${lang}/dashboard/faq`;

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
        en: `${BASE_URL}/en/dashboard/faq`,
        ro: `${BASE_URL}/ro/dashboard/faq`,
        ru: `${BASE_URL}/ru/dashboard/faq`,
      },
    },
  };
}

export default function FAQAdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
