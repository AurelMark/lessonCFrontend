"use client";

import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { i18n } from "@/src/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/componentsUI/select";
import { Label } from "@/componentsUI/label";

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    Cookies.set("NEXT_LOCALE", newLocale, { expires: 365, path: "/" });
    const segments = pathname.split("/").filter(Boolean);
    segments[0] = newLocale;
    const newPath = "/" + segments.join("/");
    router.replace(newPath);
    router.refresh();
  };

  const currentLocale = pathname.split("/")[1] ?? i18n.defaultLocale;

  return (
    <>
      <Label id="language-label" className="sr-only">
        Select language
      </Label>
      <Select onValueChange={handleChange} defaultValue={currentLocale}>
        <SelectTrigger aria-label="Select language">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {i18n.locales.map((locale) => (
            <SelectItem key={locale} value={locale}>
              {locale.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
