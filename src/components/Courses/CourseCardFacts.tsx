import { LANGUAGES_TYPE, LEVEL_SKILLS } from "@/constants";
import { getDurationLabel } from "@/lib/featureEnding";
import { LANG_TYPE } from "@/types";
import { useLocale, useTranslations } from "use-intl";

type CourseFeaturesProps = {
  lectures: string;
  quizzes: string;
  duration: string | number;
  durationType: string;
  skillLevel: string;
  language: string;
  students: string | number;
  asssessments: boolean;
};

export function CourseFacts({
  lectures,
  quizzes,
  duration,
  durationType,
  skillLevel,
  language,
  students,
  asssessments,
}: CourseFeaturesProps) {
  const t = useTranslations("facts");
  const locale = useLocale() as LANG_TYPE;

  return (
    <div className="bg-muted/40 rounded-xl shadow p-6 max-w-2xl mt-3 mx-auto">
      <div className="grid grid-cols-2 gap-y-2 text-sm">
        <span className="font-semibold">{t("lectures")}</span>
        <span>{lectures}</span>
        <span className="font-semibold">{t("quizzes")}</span>
        <span>{quizzes}</span>
        <span className="font-semibold">{t("duration")}</span>
        <span>
          {duration} {getDurationLabel(String(duration), durationType, locale)}
        </span>
        <span className="font-semibold">{t("skillLevel")}</span>
        <span>
          {
            LEVEL_SKILLS.level[locale][
              skillLevel as keyof (typeof LEVEL_SKILLS.level)[typeof locale]
            ]
          }
        </span>
        <span className="font-semibold">{t("language")}</span>
        <span>
          {
            LANGUAGES_TYPE.language[locale][
              language as keyof (typeof LANGUAGES_TYPE.language)[typeof locale]
            ]
          }
        </span>
        <span className="font-semibold">{t("students")}</span>
        <span>{students}</span>
        <span className="font-semibold">{t("asssessments")}</span>
        <span>{asssessments ? t("yes") : t("no")}</span>
      </div>
    </div>
  );
}
