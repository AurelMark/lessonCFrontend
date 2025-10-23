"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { Button } from "@/componentsUI/button";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export function CookieConsent() {
  const t = useTranslations("userRights");
  const [visible, setVisible] = useState(false);
  const CookieState = Cookies.get("cookieConsent");

  useEffect(() => {
    if (!CookieState) setVisible(true);
  }, [CookieState]);

  const handleAccept = () => {
    Cookies.set("cookieConsent", "true", { expires: 365 });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[1000001] flex justify-center pointer-events-none ">
      <Card className="pointer-events-auto max-w-2xl w-full rounded-t-xl shadow-2xl border bg-background/95 dark:bg-background flex flex-row items-center justify-between px-5 py-4 mb-0 mx-2">
        <div className="text-sm md:text-base flex flex-col md:flex-row md:items-center gap-2">
          <span>{t("consentBanner")}</span>
          <Link
            href="/user-rights"
            className="text-blue-600 underline font-semibold hover:text-blue-800 ml-2"
          >
            {t("title")}
          </Link>
        </div>
        <Button
          size="sm"
          className="ml-4 px-5 rounded-full"
          onClick={handleAccept}
        >
          {t("ok")}
        </Button>
      </Card>
    </div>
  );
}
