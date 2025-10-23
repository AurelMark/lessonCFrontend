// app/[locale]/dashboard/subcourse/edit/[slug]/layout.tsx
import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Edit Subcourse", description: "Edit the selected subcourse." },
  ro: {
    title: "Editează subcursul",
    description: "Editează subcursul selectat.",
  },
  ru: {
    title: "Редактировать субкурс",
    description: "Редактировать выбранный субкурс.",
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
  const url = `${BASE_URL}/${lang}/dashboard/subcourse/edit/${slug}`;

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
        en: `${BASE_URL}/en/dashboard/subcourse/edit/${slug}`,
        ro: `${BASE_URL}/ro/dashboard/subcourse/edit/${slug}`,
        ru: `${BASE_URL}/ru/dashboard/subcourse/edit/${slug}`,
      },
    },
  };
}

export default function SubcourseEditLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
