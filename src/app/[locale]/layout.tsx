import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { ThemeProvider } from "next-themes";
import { ReactQueryProvider } from "@/lib/react-query-provider";
import { routing } from "@/i18n/routing";
import "react-quill-new/dist/quill.snow.css";
import "./globals.css";
import { Toaster } from "@/componentsUI/sonner";
import { PARAMS_PROMISE } from "@/types";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: PARAMS_PROMISE;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const localeToMessages = {
    en: () => import("@/src/messages/en.json"),
    ro: () => import("@/src/messages/ro.json"),
    ru: () => import("@/src/messages/ru.json"),
  };

  if (!Object.keys(localeToMessages).includes(locale)) {
    notFound();
  }

  const messages = (
    await localeToMessages[locale as keyof typeof localeToMessages]()
  ).default;

  const titles = {
    en: "Home Page – Phonetics Learning Center",
    ro: "Pagina principală – Phonetics Learning Center",
    ru: "Главная страница – Phonetics Learning Center",
  };

  const descriptions = {
    en: "PHONETICS – Learn English with us!",
    ro: "PHONETICS – Învățați engleza împreună cu noi!",
    ru: "PHONETICS – Учите английский вместе с нами!",
  };

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <head>
        <title>{titles[locale as keyof typeof titles]}</title>
        <meta
          name="description"
          content={descriptions[locale as keyof typeof descriptions]}
        />
      </head>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster />
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
