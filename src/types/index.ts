export type LANG_TYPE = 'ro' | 'ru' | 'en';
export type PARAMS_PROMISE = Promise<{ locale: LANG_TYPE, slug?: string, id?: string, userId?: string }>;