import { defineRouting } from 'next-intl/routing';
import { DEFAULT_LANG, LANG_TYPE } from '@/constants';

export const routing = defineRouting({
    locales: LANG_TYPE,
    defaultLocale: DEFAULT_LANG
});