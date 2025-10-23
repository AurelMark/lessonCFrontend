import { z } from 'zod';

export const FAQFormSchema = z.object({
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
    answer: z.object({
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
    question: z.object({
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
});

export const FAQSchema = z.object({
    title: z.string(),
    answer: z.string(),
    question: z.string()
});

export const FAQArraySchema = z
    .array(FAQFormSchema)
    .min(1, {
        message: {
            ro: "Adăugați cel puțin un element",
            ru: "Добавьте хотя бы один элемент",
            en: "Add at least one item",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any
    });
export const FAQArrayResponseSchema = z
    .array(FAQFormSchema)
    .nullable()

export const FAQResponseUpdateSchema = z.object({
    message: z.string()
})

export const FAQFormWrapperSchema = z.object({
    faqs: FAQArraySchema,
});


export type FAQForm = z.infer<typeof FAQFormSchema>;
export type FAQ = z.infer<typeof FAQSchema>;
export type FAQArray = z.infer<typeof FAQArraySchema>;
export type FAQResponseUpdate = z.infer<typeof FAQResponseUpdateSchema>;
export type FAQFormWrapper = z.infer<typeof FAQFormWrapperSchema>;
export type FAQArrayResponse = z.infer<typeof FAQArrayResponseSchema>;