"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getFAQData } from "@/api/faq";
import { HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/componentsUI/button";
import LocalizedFAQAccordion from "@/components/FAQ/LocalizedFAQAccordion";
import Footer from "@/custom/Footer";

export default function AdminHomepage() {
  const t = useTranslations("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["faqData"],
    queryFn: () => getFAQData(),
    staleTime: 0,
    gcTime: 0,
  });

  if (isLoading) {
    return (
      <div className="sticky inset-0 flex items-center justify-center bg-background z-50 h-screen">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="text-red-500 font-semibold mb-2">
          {t("faq.errorLoadingData")}
        </div>
        <Button onClick={() => refetch()}>{t("faq.reload")}</Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 p-8 bg-background shadow-lg border-2">
        <h2 className="flex items-center gap-3 text-3xl md:text-4xl font-extrabold mb-8">
          <HelpCircle className="w-8 h-8" />
          {t("menu.faq")}
        </h2>
        <LocalizedFAQAccordion items={data || []} />
      </div>
      <Footer />
    </>
  );
}
