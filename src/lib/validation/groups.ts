import { z } from 'zod';

export const GroupsUserSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    role: z.string().optional(),
    id: z.string().optional()
})

export const GroupsLessonSchema = z.object({
    title: z.object({
        ro: z.string(),
        ru: z.string(),
        en: z.string(),
    }),
    imageUrl: z.string(),
    description: z.object({
        ro: z.string(),
        ru: z.string(),
        en: z.string(),
    }),
    slug: z.string(),
    id: z.string().optional()
})

export const GroupsExamsSchema = z.object({
    id: z.string().optional(),
    title: z.object({
        ro: z.string(),
        ru: z.string(),
        en: z.string(),
    }),
    imageUrl: z.string(),
    description: z.object({
        ro: z.string(),
        ru: z.string(),
        en: z.string(),
    }),
    slug: z.string()
})

export const GroupsSchema = z.object({
    title: z.object({
        ro: z.string(),
        ru: z.string(),
        en: z.string(),
    }),
    users: z.array(GroupsUserSchema).nullable(),
    lessons: z.array(GroupsLessonSchema).nullable(),
    exams: z.array(GroupsExamsSchema).nullable(),
    responsible: z.array(GroupsUserSchema).nullable(),
    createdBy: GroupsUserSchema,
    id: z.string().optional()
});

export const GroupsDeleteByIdSchema = z.object({
    message: z.string(),
    success: z.boolean()
})

export const GroupsListSchema = z.array(GroupsSchema);

export const GroupsResponseSchema = z.object({
    totalGroups: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    totalPerPage: z.number(),
    data: GroupsListSchema
})

export const GroupsFormSchema = z.object({
    id: z.string().optional(),
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
    users: z.union([
        z.array(z.string()).min(1, {
            message: {
                ro: "Selectați cel puțin un utilizator",
                ru: "Выберите хотя бы одного пользователя",
                en: "Select at least one user",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
        z.array(
            z.object({
                firstName: z.string(),
                lastName: z.string(),
                email: z.string().email(),
                role: z.string(),
                id: z.string().optional(),
            })
        ),
    ]).optional(),
    lessons: z.union([
        z.array(z.string()),
        z.array(
            z.object({
                title: z.object({
                    ro: z.string(),
                    ru: z.string(),
                    en: z.string(),
                }),
                imageUrl: z.string(),
                description: z.string(),
                slug: z.string(),
                id: z.string().optional(),
            })
        ),
    ]).optional(),
    exams: z.union([
        z.array(z.string()),
        z.array(
            z.object({
                title: z.object({
                    ro: z.string(),
                    ru: z.string(),
                    en: z.string(),
                }),
                imageUrl: z.string(),
                description: z.string(),
                slug: z.string(),
                id: z.string().optional(),
            })
        ),
    ]).optional(),
    responsible: z.union([
        z.array(z.string()).min(1, {
            message: {
                ro: "Selectați responsabilul",
                ru: "Выберите ответственного",
                en: "Select a responsible user",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
        z.array(
            z.object({
                firstName: z.string(),
                lastName: z.string(),
                email: z.string(),
                login: z.string(),
                id: z.string().optional(),
            })
        ).min(1, {
            message: {
                ro: "Selectați responsabilul",
                ru: "Выберите ответственного",
                en: "Select a responsible user",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
    ]),
    createdBy: z.union([
        z.string().min(1, {
            message: {
                ro: "Selectați creatorul grupului",
                ru: "Выберите создателя группы",
                en: "Select the group creator",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }),
        z.object({
            firstName: z.string(),
            lastName: z.string(),
            email: z.string(),
            login: z.string(),
            id: z.string().optional(),
        }),
    ]),
});

export type GroupsUser = z.infer<typeof GroupsUserSchema>;
export type GroupsLesson = z.infer<typeof GroupsLessonSchema>;
export type GroupsExams = z.infer<typeof GroupsExamsSchema>;
export type Groups = z.infer<typeof GroupsSchema>;
export type GroupsList = z.infer<typeof GroupsListSchema>;
export type GroupsResponse = z.infer<typeof GroupsResponseSchema>;
export type GroupsDeleteById = z.infer<typeof GroupsDeleteByIdSchema>;
export type GroupsForm = z.infer<typeof GroupsFormSchema>;