import { z } from 'zod';

export const CourseFeatureSchema = z.object({
    lectures: z.string(),
    quizzes: z.string(),
    duration: z.union([z.string(), z.number()]),
    durationType: z.string(),
    skillLevel: z.string(),
    language: z.string(),
    students: z.union([z.string(), z.number()]),
    asssessments: z.boolean()
})


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

export const CourseListEventSchema = z.object({
    title: z.object({
        ro: z.string(),
        en: z.string(),
        ru: z.string()
    }),
    description: z.object({
        ro: z.string(),
        en: z.string(),
        ru: z.string()
    }),
    content: z.object({
        ro: z.string(),
        en: z.string(),
        ru: z.string()
    }),
    imageUrl: z.string(),
    slug: z.string(),
    features: CourseFeatureSchema,
    id: z.string().optional(),
    alert: z.array(z.object({
        type: z.string(),
        color: z.string(),
        content: z.object({
            ro: z
                .string(),
            ru: z
                .string(),
            en: z
                .string(),
        })
    })).optional()
})
export const CourseListArraySchema = z.array(CourseListEventSchema);

export const SubCoursesSchema = z.object({
    courseSlug: z.string(),
    description: z.object({
        ro: z.string(),
        en: z.string(),
        ru: z.string()
    }),
    imageUrl: z.string(),
    price: z.union([z.number(), z.string()]),
    title: z.object({
        ro: z.string(),
        en: z.string(),
        ru: z.string()
    }),
    id: z.string().optional()
})

export const SubCoursesArraySchemma = z.array(SubCoursesSchema).nullable()

export const CourseSlugSchema = z.object({
    course: CourseListEventSchema,
    subcourses: SubCoursesArraySchemma
})

export const CourseListParamsSchema = z.object({
    currentPage: z.number(),
    data: CourseListArraySchema,
    coursePerPage: z.number(),
    total: z.number(),
    totalPages: z.number(),
});

export const CourseDeleteByIdSchema = z.object({
    message: z.string()
});




export const CourseFormSchema = z.object({
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
    id: z.string().optional(),
    features: z.object({
        lectures: z.string().min(1, {
            message: {
                ro: "Completați câmpul în română",
                ru: "Заполните поле на румынском языке",
                en: "Fill in the field in Romanian",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
        quizzes: z.string().min(1, {
            message: {
                ro: "Completați câmpul în română",
                ru: "Заполните поле на румынском языке",
                en: "Fill in the field in Romanian",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
        duration: z.string().min(1, {
            message: {
                ro: "Completați câmpul în română",
                ru: "Заполните поле на румынском языке",
                en: "Fill in the field in Romanian",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
        durationType: z.string().min(1, {
            message: {
                ro: "Completați câmpul în română",
                ru: "Заполните поле на румынском языке",
                en: "Fill in the field in Romanian",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
        skillLevel: z.string().min(1, {
            message: {
                ro: "Completați câmpul în română",
                ru: "Заполните поле на румынском языке",
                en: "Fill in the field in Romanian",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
        language: z.string().min(1, {
            message: {
                ro: "Completați câmpul în română",
                ru: "Заполните поле на румынском языке",
                en: "Fill in the field in Romanian",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
        students: z.string().min(1, {
            message: {
                ro: "Completați câmpul în română",
                ru: "Заполните поле на румынском языке",
                en: "Fill in the field in Romanian",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
        asssessments: z.boolean({
            message: {
                ro: "Completați câmpul în română",
                ru: "Заполните поле на румынском языке",
                en: "Fill in the field in Romanian",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        })
    }),
    alert: z.array(z.object({
        type: z.string().min(1, {
            message: {
                ro: "Completați câmpul în română",
                ru: "Заполните поле на румынском языке",
                en: "Fill in the field in Romanian",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
        color: z.string().min(1, {
            message: {
                ro: "Completați câmpul în română",
                ru: "Заполните поле на румынском языке",
                en: "Fill in the field in Romanian",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
        content: LocalizedStringSchema
    })).optional()
});

export const SubcourseFormSchema = z.object({
    title: LocalizedStringSchema,
    description: LocalizedStringSchema,
    imageUrl: z.string().optional(),
    courseSlug: z.string().optional(),
    id: z.string().optional(),
    price: z.string().min(1, {
        ro: "Completați câmpul în română",
        ru: "Заполните поле на румынском языке",
        en: "Fill in the field in Romanian",
    } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    )
});

export type CourseList = z.infer<typeof CourseListArraySchema>;
export type CourseEvent = z.infer<typeof CourseListEventSchema>;
export type CourseListParams = z.infer<typeof CourseListParamsSchema>;
export type CourseFeature = z.infer<typeof CourseFeatureSchema>;
export type CourseSlug = z.infer<typeof CourseSlugSchema>;
export type SubCourses = z.infer<typeof SubCoursesSchema>;
export type CourseDeleteById = z.infer<typeof CourseDeleteByIdSchema>;
export type CourseForm = z.infer<typeof CourseFormSchema>;
export type SubCoursesArray = z.infer<typeof SubCoursesArraySchemma>;
export type SubcourseForm = z.infer<typeof SubcourseFormSchema>;