import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: {
    title: "History Logs",
    description: "View all activity logs and history records.",
  },
  ro: {
    title: "Jurnal de activitate",
    description: "Vizualizează toate log-urile și înregistrările de istoric.",
  },
  ru: {
    title: "Журнал истории",
    description: "Просмотреть все журналы активности и записи истории.",
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
  const url = `${BASE_URL}/${lang}/dashboard/history-logs`;

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
        en: `${BASE_URL}/en/dashboard/history-logs`,
        ro: `${BASE_URL}/ro/dashboard/history-logs`,
        ru: `${BASE_URL}/ru/dashboard/history-logs`,
      },
    },
  };
}

export default function HistoryLogsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
