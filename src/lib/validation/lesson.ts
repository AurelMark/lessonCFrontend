import { z } from "zod";

export const LessonMaterialSchema = z.object({
    name: z.string().min(1, "Название обязательно"),
    type: z.string().min(1, "Тип обязателен"),
    url: z.string().min(1, "URL обязателен"),
    order: z.number().default(0).optional(),
});

const LocalizedStringSchema = z.object({
    ro: z
        .string()
        .min(1, {
            message: {
                ro: "Completați câmpul în română",
                ru: "Заполните поле на румынском языке",
                en: "Fill in the field in Romanian",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
    ru: z
        .string()
        .min(1, {
            message: {
                ro: "Completați câmpul în rusă",
                ru: "Заполните поле на русском языке",
                en: "Fill in the field in Russian",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
    en: z
        .string()
        .min(1, {
            message: {
                ro: "Completați câmpul în engleză",
                ru: "Заполните поле на английском языке",
                en: "Fill in the field in English",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
});

const ObjectIdSchema = z
    .string()
    .min(16, {
        message: {
            ro: "ID invalid (ObjectId)",
            ru: "Некорректный ObjectId",
            en: "Invalid ObjectId",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    });

const MaterialSchema = z.object({
    name: z.string().min(1, {
        message: {
            ro: "Numele materialului este obligatoriu",
            ru: "Название материала обязательно",
            en: "Material name is required",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
    type: z.string().min(1, {
        message: {
            ro: "Tipul materialului este obligatoriu",
            ru: "Тип материала обязателен",
            en: "Material type is required",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
    url: z.string().url({
        message: {
            ro: "Introduceți un URL valid",
            ru: "Введите корректный URL",
            en: "Enter a valid URL",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
    order: z.number().int(),
    id: z.string().optional()
});

const ExamSchema = z.object({
    title: LocalizedStringSchema,
    description: LocalizedStringSchema,
    imageUrl: z.string().url({
        message: {
            ro: "Adăugați un URL valid pentru imagine",
            ru: "Добавьте корректную ссылку на изображение",
            en: "Provide a valid image URL",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
    slug: z.string().min(1, {
        message: {
            ro: "Slug-ul este obligatoriu",
            ru: "Slug обязателен",
            en: "Slug is required",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
    id: z.string().optional()
});


export const LessonSchemaZod = z.object({
    id: z.string(),
    title: z.object({
        ro: z.string(),
        ru: z.string(),
        en: z.string(),
    }),
    description: z.object({
        ro: z.string(),
        ru: z.string(),
        en: z.string(),
    }),
    content: z.object({
        ro: z.string(),
        ru: z.string(),
        en: z.string(),
    }),
    imageUrl: z
        .string()
        .optional(),
    slug: z
        .string()
        .optional(),
    createdBy: z.object({
        id: z.string().optional(),
        email: z.string().email({
            message: {
                ro: "Email-ul autorului este obligatoriu",
                ru: "Email автора обязателен",
                en: "Author email is required",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
        firstName: z.string().min(1, {
            message: {
                ro: "Prenumele autorului este obligatoriu",
                ru: "Имя автора обязательно",
                en: "Author first name is required",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
        lastName: z.string().min(1, {
            message: {
                ro: "Numele autorului este obligatoriu",
                ru: "Фамилия автора обязательна",
                en: "Author last name is required",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
        role: z.string().min(1, {
            message: {
                ro: "Rolul autorului este obligatoriu",
                ru: "Роль автора обязательна",
                en: "Author role is required",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
    }).nullable().optional(),
    groups: z.union([z.array(z.object({
        id: z.string().optional(),
        title: z.object({
            en: z.string(),
            ro: z.string(),
            ru: z.string(),
        })
    })), z.array(z.string())]).nullable(),
    examen: z.array(ExamSchema).optional(),
    isActive: z.boolean().default(true).optional(),
    materials: z.array(MaterialSchema).optional()
});

export const LessonArraySchemaZod = z.array(LessonSchemaZod);

export const LessonListParamsSchema = z.object({
    currentPage: z.number(),
    data: LessonArraySchemaZod,
    lessonsPerPage: z.number(),
    totalLessons: z.number(),
    totalPages: z.number(),
});

export const LessonDeleteByIdSchema = z.object({
    message: z.string()
})

export const LessonFormSchema = z.object({
    title: LocalizedStringSchema,
    description: LocalizedStringSchema,
    content: z.object({
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
    imageUrl: z.string().optional(),
    slug: z.string().optional(),
    createdBy: ObjectIdSchema,
    materials: z.array(MaterialSchema).nullable(),
    groups: z.array(ObjectIdSchema).optional(),
    examen: z.array(ObjectIdSchema).optional(),
    isActive: z.boolean(),
    id: z.string().optional()
});

export type LessonZod = z.infer<typeof LessonSchemaZod>;
export type LessonArray = z.infer<typeof LessonArraySchemaZod>;
export type LessonListParams = z.infer<typeof LessonListParamsSchema>;
export type LessonDeleteById = z.infer<typeof LessonDeleteByIdSchema>;
export type LessonForm = z.infer<typeof LessonFormSchema>;
export type MaterialsLesson = z.infer<typeof MaterialSchema>;