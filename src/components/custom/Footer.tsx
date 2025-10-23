"use client";

import { siFacebook, siYoutube, siInstagram } from "simple-icons";
import { MapPin, Phone, Mail } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslations } from "next-intl";

const MapFooter = dynamic(() => import("@/components/custom/MapFooter"));

type SimpleIconType = {
  title: string;
  slug: string;
  hex: string;
  source: string;
  svg: string;
  path: string;
  guidelines?: string;
  license?: { type: string; url: string };
};

function SimpleIcon({
  icon,
  color,
  size = 18,
  className = "",
}: {
  icon: SimpleIconType;
  color?: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-label={icon.title}
      className={className}
    >
      <title>{icon.title}</title>
      <path fill={color || `#${icon.hex}`} d={icon.path} />
    </svg>
  );
}

export default function Footer() {
  const t = useTranslations("");
  return (
    <footer className="w-full mt-12">
      <div className="bg-secondary dark:bg-background rounded-xl px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-lg border">
        <div>
          <div className="flex items-center justify-center mb-3">
            <h3 className="text-xl font-bold">{t("footer.followUs")}</h3>
          </div>
          <ul className="space-y-2 ml-1">
            <li className="flex items-center justify-center gap-2">
              <SimpleIcon icon={siFacebook} />
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Facebook
              </Link>
            </li>
            <li className="flex items-center justify-center gap-2">
              <SimpleIcon icon={siYoutube} />
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Youtube
              </Link>
            </li>
            <li className="flex items-center justify-center gap-2">
              <SimpleIcon icon={siInstagram} />
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Instagram
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-center md:text-center">
          <div className="flex items-center justify-center mb-3">
            <MapPin className="text-blue-500 mr-2" />
            <h3 className="text-xl font-bold">{t("footer.address")}</h3>
          </div>
          <p>Mun. Chișinău, Strada Vasile Alecsandri 105</p>
          <div style={{ height: "300px", width: "100%" }}>
            <MapFooter />
          </div>
        </div>
        <div className="text-right md:text-right">
          <div className="flex items-center justify-center mb-3">
            <Phone className="text-blue-500 mr-2" />
            <h3 className="text-xl font-bold">{t("footer.contacts")}</h3>
          </div>
          <ul className="space-y-1">
            <li className="flex items-center gap-2 justify-center">
              <Mail size={18} />
              <a
                href="mailto:phonetics.md@gmail.com"
                className="hover:underline"
              >
                phonetics.md@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2 justify-center">
              <a href="tel:069910011" className="hover:underline">
                069910011
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-slate-900 text-white dark:bg-secondary py-3 text-center">
        {t("footer.createdWith")}
        <span className="text-red-500">❤</span>
        <br /> {t("footer.forCenter")} 2013 - {new Date().getFullYear()}
      </div>
    </footer>
  );
}
