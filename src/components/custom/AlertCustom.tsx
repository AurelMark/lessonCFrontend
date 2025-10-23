import { Alert, AlertDescription, AlertTitle } from "@/componentsUI/alert";
import { cn } from "@/lib/utils";
import { LANG_TYPE } from "@/types";
import { useLocale } from "next-intl";

type TAlertCustom = {
  type?: string;
  color: string;
  content: {
    ro: string;
    ru: string;
    en: string;
  };
};

export function AlertCustom({ type, color, content }: TAlertCustom) {
  const locale = useLocale() as LANG_TYPE;
  return (
    <Alert className={color}>
      {type && <AlertTitle>{type}</AlertTitle>}
      <AlertDescription className={cn('text-lg text-black', color)}>
        {content?.[locale] || "-"}
      </AlertDescription>
    </Alert>
  );
}
