"use client";

import { useLocale, useTranslations } from "next-intl";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getHomepageData } from "@/api/homepage";
import { LANG_TYPE } from "@/types";
import { Loader2 } from "lucide-react";
import { AuthLog } from "@/custom/Auth";
import MainMenu from "@/custom/MainMenu";
import FounderImage from "@/public/founder.jpg";
import { Separator } from "@/componentsUI/separator";
import Footer from "@/custom/Footer";
import { CookieConsent } from "@/custom/CookieConsent";
import Link from "next/link";

export default function HomePage() {
  const t = useTranslations();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const locale = useLocale() as LANG_TYPE;

  const { data, isLoading, error } = useQuery({
    queryKey: ["getHomepageData"],
    queryFn: getHomepageData,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    function onSelect() {
      setCurrent(api?.selectedScrollSnap() ?? 0);
    }

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      const next =
        api.selectedScrollSnap() + 1 >= api.scrollSnapList().length
          ? 0
          : api.selectedScrollSnap() + 1;
      api.scrollTo(next);
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  const handleRedirectToUrl = (url: string) => {
    window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div className="sticky inset-0 flex items-center justify-center bg-background z-50 h-screen">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 font-semibold mb-2">
          {t("errorLoadingData")}
        </div>
        <Button onClick={() => window.location.reload()}>{t("reload")}</Button>
      </div>
    );
  }

  return (
    <div>
      <AuthLog />
      <MainMenu />
      <div>
        {data && data.slider && (
          <Carousel className="w-full cursor-grab" setApi={setApi}>
            <CarouselContent className="-ml-1">
              {data.slider.map((el, index) => (
                <CarouselItem key={index} className="pl-1">
                  <div className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                    <Image
                      src={el.imageUrl}
                      alt={el.title[locale]}
                      fill
                      className="absolute inset-0 w-full h-full object-cover object-center z-0"
                      draggable={false}
                      loading={index === 0 ? "eager" : "lazy"}
                      priority={index === 0}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 70vw"
                      placeholder={index === 0 ? "empty" : "empty"}
                    />
                    <div className="absolute inset-0 bg-blue-900/30 z-10" />
                    <div className="relative z-20 flex flex-col items-center justify-end h-full w-full px-4 pb-12">
                      <div className="bg-background/20 rounded-xl p-8 w-full mx-auto backdrop-blur">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 text-center drop-shadow">
                          {el.title[locale]}
                        </h1>
                        <p className="text-lg md:text-2xl text-white/90 mb-8 text-center w-full drop-shadow ">
                          {el.description[locale]}
                        </p>
                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            onClick={() => handleRedirectToUrl(el.link)}
                          >
                            {t("homepage.goToLink")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
        <div className="flex justify-center gap-2 mt-4">
          {data?.slider?.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => api?.scrollTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                "relative flex items-center justify-center p-2",
                current === idx ? "scale-110" : "opacity-80 hover:opacity-100"
              )}
            >
              <span
                className={cn(
                  "block w-3 h-3 rounded-full transition-colors",
                  current === idx
                    ? "bg-primary shadow-lg"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <Carousel className="w-full my-8 max-w-7xl">
          <CarouselContent className="-ml-1">
            {data?.education?.map((el, idx) => (
              <CarouselItem
                key={idx}
                className="pl-1 md:basis-1/2 lg:basis-1/3"
              >
                <div className="flex flex-col h-[420px] w-full overflow-hidden shadow-lg">
                  <div
                    className={`relative flex-1 flex flex-col items-center justify-center px-6 py-8 bg-gradient-to-br ${
                      idx % 2 === 0
                        ? "from-cyan-500 to-teal-400"
                        : "from-orange-500 to-rose-400"
                    }`}
                  >
                    <h2 className="text-2xl font-bold text-white text-center">
                      {el.title[locale]}
                    </h2>
                    <p className="mt-2 text-white/90 text-center">
                      {el.description[locale]}
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6 font-semibold text-center hover:border hover:border-white"
                      onClick={() => window.open(el.link, "_blank")}
                    >
                      {t("homepage.goToLink")}
                    </Button>
                  </div>
                  <div className="h-[160px] w-full overflow-hidden flex items-end justify-center relative">
                    <Image
                      src={el.imageUrl}
                      alt={el.title[locale]}
                      fill
                      className="h-full object-cover object-center"
                      draggable={false}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <section className="relative w-full bg-secondary overflow-hidden pb-20 my-8">
        <div className="relative z-10 flex flex-col items-center justify-center pt-14 pb-28 px-4">
          <h2 className="text-3xl md:text-5xl text-center mb-10 tracking-tight">
            {t("homepage.aboutUs.aboutTitle")}
          </h2>
          <div className="relative w-64 h-64 rounded-2xl overflow-hidden mb-8 shadow-xl border-4 border-white">
            <Image
              src={FounderImage}
              alt={t("homepage.aboutUs.founderMessage")}
              fill
              className="object-cover scale-105 hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>

          <h2 className="text-2xl text-center mb-2 text-foreground/80 tracking-wide uppercase">
            {t("homepage.aboutUs.founderMessageTitle")}
          </h2>

          <Separator className="max-w-md mb-6 border-dashed border-2 border-accent dark:border-white/30" />

          <p className="text-center max-w-2xl mx-auto mb-8 text-lg md:text-xl leading-relaxed text-muted-foreground italic">
            “{t("homepage.aboutUs.founderMessage")}”
          </p>
          <Link
            href="/about-us"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-base font-semibold hover:underline underline-offset-4 text-primary"
            )}
          >
            {t("homepage.aboutUs.moreDetails")} →
          </Link>
        </div>
      </section>

      <section className="w-full max-w-5xl mx-auto pb-24 pt-10">
        <div className="mb-12 text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t("whyChooseUs.title")}
          </h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-base md:text-lg">
              {t("whyChooseUs.description")}
            </p>
          </div>
        </div>

        <div className="space-y-20">
          {data?.info?.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col-reverse md:flex-row px-8 ${
                idx % 2 !== 0 ? "md:flex-row-reverse" : ""
              } gap-8 md:gap-12 items-center`}
            >
              <div className="w-full md:flex-1 space-y-4 bg-secondary p-8 rounded-2xl shadow-lg transition-all hover:shadow-3xl">
                <h3 className="text-xl md:text-2xl font-semibold">
                  {item.title[locale]}
                </h3>
                <p className="text-base md:text-lg">
                  {item.description[locale]}
                </p>
              </div>

              <div className="w-full md:flex-1 flex items-center justify-center">
                <div className="relative w-full max-w-sm aspect-[4/3] rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src={item.imageUrl}
                    alt={item.title[locale]}
                    fill
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mt-20 text-center space-y-2 bg-secondary p-8">
          <p className="text-xl md:text-2xl font-semibold opacity-70">
            {t("whyChooseUs.learningMeaning")}
          </p>
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </div>
  );
}
