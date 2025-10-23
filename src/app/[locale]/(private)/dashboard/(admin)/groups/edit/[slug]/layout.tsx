// app/[locale]/dashboard/group/edit/[id]/layout.tsx
import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: { title: "Edit Group", description: "Edit the selected group." },
  ro: { title: "Editează grupul", description: "Editează grupul selectat." },
  ru: {
    title: "Редактировать группу",
    description: "Редактировать выбранную группу.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const lang = locale as "ro" | "ru" | "en";
  const content = messages[lang];
  const url = `${BASE_URL}/${lang}/dashboard/group/edit/${id}`;

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
        en: `${BASE_URL}/en/dashboard/group/edit/${id}`,
        ro: `${BASE_URL}/ro/dashboard/group/edit/${id}`,
        ru: `${BASE_URL}/ru/dashboard/group/edit/${id}`,
      },
    },
  };
}

export default function GroupEditLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
