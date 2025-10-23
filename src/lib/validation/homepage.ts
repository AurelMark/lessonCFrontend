import { z } from 'zod';

export const HomepageFormFieldsValidation = z.object({
    title: z.object({
        ro: z.string().min(1, {
            message: {
                ro: "Introduceți denumirea în română",
                ru: "Введите название на румынском",
                en: "Enter title in Romanian",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
        ru: z.string().min(1, {
            message: {
                ro: "Introduceți denumirea în rusă",
                ru: "Введите название на русском",
                en: "Enter title in Russian",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
        en: z.string().min(1, {
            message: {
                ro: "Introduceți denumirea în engleză",
                ru: "Введите название на английском",
                en: "Enter title in English",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
    }),
    description: z.object({
        ro: z.string().min(1, {
            message: {
                ro: "Introduceți denumirea în română",
                ru: "Введите название на румынском",
                en: "Enter title in Romanian",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
        ru: z.string().min(1, {
            message: {
                ro: "Introduceți denumirea în rusă",
                ru: "Введите название на русском",
                en: "Enter title in Russian",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
        en: z.string().min(1, {
            message: {
                ro: "Introduceți denumirea în engleză",
                ru: "Введите название на английском",
                en: "Enter title in English",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
    }),
    imageUrl: z.string().min(1, {
        message: {
            ro: "Introduceți denumirea în engleză",
            ru: "Введите название на английском",
            en: "Enter title in English",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any
    }),
    link: z.string().min(1, {
        message: {
            ro: "Introduceți denumirea în engleză",
            ru: "Введите название на английском",
            en: "Enter title in English",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any
    }),
});

export const HomepageFormFieldsInformationalValidation = z.object({
    title: z.object({
        ro: z.string().min(1, {
            message: {
                ro: "Introduceți denumirea în română",
                ru: "Введите название на румынском",
                en: "Enter title in Romanian",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
        ru: z.string().min(1, {
            message: {
                ro: "Introduceți denumirea în rusă",
                ru: "Введите название на русском",
                en: "Enter title in Russian",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
        en: z.string().min(1, {
            message: {
                ro: "Introduceți denumirea în engleză",
                ru: "Введите название на английском",
                en: "Enter title in English",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
    }),
    description: z.object({
        ro: z.string().min(1, {
            message: {
                ro: "Introduceți denumirea în română",
                ru: "Введите название на румынском",
                en: "Enter title in Romanian",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
        ru: z.string().min(1, {
            message: {
                ro: "Introduceți denumirea în rusă",
                ru: "Введите название на русском",
                en: "Enter title in Russian",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
        en: z.string().min(1, {
            message: {
                ro: "Introduceți denumirea în engleză",
                ru: "Введите название на английском",
                en: "Enter title in English",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
    }),
    imageUrl: z.string().min(1, {
        message: {
            ro: "Introduceți denumirea în engleză",
            ru: "Введите название на английском",
            en: "Enter title in English",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any
    }),
    link: z.string(),
});

export const HomepageFormSchema = z.object({
    slider: z.array(HomepageFormFieldsValidation).min(1, {
        message: {
            ro: "Adăugați cel puțin un element în slider.",
            ru: "Добавьте хотя бы один элемент в слайдер.",
            en: "Add at least one item to the slider.",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any
    }),
    info: z.array(HomepageFormFieldsInformationalValidation).min(1, {
        message: {
            ro: "Adăugați cel puțin un element în info.",
            ru: "Добавьте хотя бы один элемент в info.",
            en: "Add at least one item to info.",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any
    }),
    education: z.array(HomepageFormFieldsValidation).min(1, {
        message: {
            ro: "Adăugați cel puțin un element în education.",
            ru: "Добавьте хотя бы один элемент в education.",
            en: "Add at least one item to education.",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any
    }),
})

export const HomepageSliderSchema = z.object({
    title: z.object({
        ro: z.string(),
        ru: z.string(),
        en: z.string()
    }),
    description: z.object({
        ro: z.string(),
        ru: z.string(),
        en: z.string()
    }),
    imageUrl: z.string(),
    link: z.string()
});

export const HomepageEducationSchema = z.object({
    title: z.object({
        ro: z.string(),
        ru: z.string(),
        en: z.string()
    }),
    description: z.object({
        ro: z.string(),
        ru: z.string(),
        en: z.string()
    }),
    imageUrl: z.string(),
    link: z.string()
});

export const HomepageInfoSchema = z.object({
    title: z.object({
        ro: z.string(),
        ru: z.string(),
        en: z.string()
    }),
    description: z.object({
        ro: z.string(),
        ru: z.string(),
        en: z.string()
    }),
    imageUrl: z.string(),
    link: z.string().optional()
});

export const HomepageResponseSchema = z.object({
    slider: z.array(HomepageSliderSchema).nullable(),
    education: z.array(HomepageEducationSchema).nullable(),
    info: z.array(HomepageInfoSchema).nullable()
});

export const HomepageResponseUpdateSchmea = z.object({
    message: z.string()
})


export type HomepageResponse = z.infer<typeof HomepageResponseSchema>;
export type HomepageSlider = z.infer<typeof HomepageSliderSchema>;
export type HomepageEducation = z.infer<typeof HomepageEducationSchema>;
export type HomepageInfo = z.infer<typeof HomepageInfoSchema>;
export type HomepageResponseSchema = z.infer<typeof HomepageResponseSchema>;
export type HomepageForm = z.infer<typeof HomepageFormSchema>;
export type HomepageResponseUpdate = z.infer<typeof HomepageResponseUpdateSchmea>;