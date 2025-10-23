import { DEFAULT_LANG, LANG_TYPE } from "@/constants";

export const i18n = {
    defaultLocale: DEFAULT_LANG,
    locales: LANG_TYPE,
} as const;

export type Locale = (typeof i18n)['locales'][number];
