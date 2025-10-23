import { z } from 'zod';

export const AboutUsValidationSchema = z.object({
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
    context: z.object({
        ro: z.string().refine(
            (val) => val.replace(/<(.|\n)*?>/g, "").trim().length > 0,
            {
                message: {
                    ro: "Introduceți conținutul în română",
                    ru: "Введите контент на румынском языке",
                    en: "Enter content in romanian",
                } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
            }
        ),
        ru: z.string().refine(
            (val) => val.replace(/<(.|\n)*?>/g, "").trim().length > 0,
            {
                message: {
                    ro: "Introduceți conținutul în rusă",
                    ru: "Введите контент на русском языке",
                    en: "Enter content in russian",
                } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
            }
        ),
        en: z.string().refine(
            (val) => val.replace(/<(.|\n)*?>/g, "").trim().length > 0,
            {
                message: {
                    ro: "Introduceți conținutul în engleză",
                    ru: "Введите контент на английском языке",
                    en: "Enter content in english",
                } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
            }
        ),
    }),
});

export const AboutUsResponseSchema = z.object({
    title: z.object({
        ro: z.string(),
        ru: z.string(),
        en: z.string()
    }),
    context: z.object({
        ro: z.string(),
        ru: z.string(),
        en: z.string()
    }),
});

export const AboutUsUpdateSchema = z.object({
    message: z.string()
})


export type AboutUsResponse = z.infer<typeof AboutUsResponseSchema>;
export type AboutUsValidation = z.infer<typeof AboutUsValidationSchema>;
export type AboutUsUpdate = z.infer<typeof AboutUsUpdateSchema>;