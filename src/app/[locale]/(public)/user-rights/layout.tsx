import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: {
    title: "User Rights & Privacy Policy",
    description:
      "Read about your privacy rights and data protection on our site.",
    og: "user-rights",
  },
  ro: {
    title: "Drepturile utilizatorului și politica de confidențialitate",
    description:
      "Aflați despre drepturile dvs. de confidențialitate și protecția datelor pe acest site.",
    og: "drepturile-utilizatorului",
  },
  ru: {
    title: "Права пользователя и политика конфиденциальности",
    description:
      "Узнайте о ваших правах на конфиденциальность и защите данных на нашем сайте.",
    og: "prava-polzovatelya",
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
  const url = `${BASE_URL}/${lang}/user-rights`;

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
        en: `${BASE_URL}/en/user-rights`,
        ro: `${BASE_URL}/ro/user-rights`,
        ru: `${BASE_URL}/ru/user-rights`,
      },
    },
  };
}

export default function UserRightsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
