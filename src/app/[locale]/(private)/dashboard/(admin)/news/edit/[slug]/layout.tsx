// edit/[slug]/page.tsx
import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Edit News", description: "Edit the selected news article." },
  ro: {
    title: "Editează noutatea",
    description: "Editează noutatea selectată.",
  },
  ru: {
    title: "Редактировать новость",
    description: "Редактировать выбранную новость.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[lang];
  const url = `${BASE_URL}/${lang}/dashboard/news/edit/${slug}`;

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
        en: `${BASE_URL}/en/dashboard/news/edit/${slug}`,
        ro: `${BASE_URL}/ro/dashboard/news/edit/${slug}`,
        ru: `${BASE_URL}/ru/dashboard/news/edit/${slug}`,
      },
    },
  };
}

export default function NewsDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
