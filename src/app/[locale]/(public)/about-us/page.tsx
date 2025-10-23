"use client";

import { getAboutUsData } from "@/api/aboutUs";
import { LANG_TYPE } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import FounderImage from "@/public/founder.jpg";
import Image from "next/image";
import Footer from "@/custom/Footer";

export default function AboutUsPage() {
  const t = useTranslations("");
  const locale = useLocale() as LANG_TYPE;

  const { data, isLoading, error } = useQuery({
    queryKey: ["getAboutUsData"],
    queryFn: () => getAboutUsData(),
    staleTime: 0,
    gcTime: 0,
  });

  if (isLoading)
    return <div className="mb-6 p-8 bg-background shadow-lg">Loading...</div>;

  if (error)
    return (
      <div className="mb-6 p-8 bg-background shadow-lg">
        <div>{t("loadError")}</div>
      </div>
    );

  const htmlContent = data?.context?.[locale] || "";
  const title = data?.title?.[locale] || "";

  return (
    <>
      <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-background rounded-lg shadow-lg border-2">
        <div className="text-left">
          <h4 className="uppercase text-sm font-semibold tracking-widest text-muted-foreground mb-4">
            {t("homepage.aboutUs.founderMessageTitle")}
          </h4>

          <h2 className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-6 leading-tight">
            {title}
          </h2>

          <div
            className="text-base md:text-lg text-muted-foreground leading-relaxed space-y-4 prose prose-a:text-blue-600 prose-a:underline prose-a:transition-all hover:prose-a:text-blue-800"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>

        <div className="w-full">
          <div className="aspect-[4/5] relative overflow-hidden rounded-lg">
            <Image
              src={FounderImage}
              alt={t("homepage.aboutUs.founderMessage")}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
