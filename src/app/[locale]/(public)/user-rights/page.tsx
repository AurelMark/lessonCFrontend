"use client";
import { useTranslations } from "next-intl";
export default function UserRightsPage() {
  const t = useTranslations("userRights");
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 bg-secondary rounded-lg shadow-md text-justify">
      <h1 className="text-2xl font-bold mb-6 text-center">{t("title")}</h1>

      <p className="mb-4">{t("intro")}</p>
      <p className="mb-4">{t("purpose")}</p>
      <p className="mb-4 font-semibold">{t("dataProcessing")}</p>

      <ul className="list-disc pl-8 space-y-2">
        <li>{t("points.a")}</li>
        <li>{t("points.b")}</li>
        <li>{t("points.c")}</li>
      </ul>

      <p className="mt-6">{t("confidentiality")}</p>
      <p className="mt-6 font-semibold text-center">{t("consent")}</p>
    </div>
  );
}
