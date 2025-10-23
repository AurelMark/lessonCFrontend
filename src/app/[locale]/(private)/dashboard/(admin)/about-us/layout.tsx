import { Metadata } from "next";
import { BASE_URL } from "@/constants";
import { ReactNode } from "react";
import { PARAMS_PROMISE } from "@/types";

const messages = {
  en: {
    title: "About Us",
    description:
      "Learn more about PHONETICS Learning Center, our mission and values.",
  },
  ro: {
    title: "Despre noi",
    description:
      "Află mai multe despre Centrul PHONETICS, misiunea și valorile noastre.",
  },
  ru: {
    title: "О нас",
    description: "Узнайте больше о центре PHONETICS, нашей миссии и ценностях.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: PARAMS_PROMISE;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = messages[locale];
  const url = `${BASE_URL}/${locale}/about`;

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
        en: `${BASE_URL}/en/about`,
        ro: `${BASE_URL}/ro/about`,
        ru: `${BASE_URL}/ru/about`,
      },
    },
  };
}

export default function AboutUsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
