import { z } from 'zod';

export const UserExamAnswersSchema = z.object({
    questionIndex: z.number(),
    selectedOptionIndex: z.number()
})

export const UserExamSchema = z.object({
    exam: z.string(),
    score: z.number(),
    submittedAt: z.string(),
    answers: z.array(UserExamAnswersSchema),
})

export const UserSchema = z.object({
    login: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.string(),
    groups: z.union([z.array(z.object({
        id: z.string(),
        title: z.object({
            en: z.string(),
            ro: z.string(),
            ru: z.string(),
        })
    })), z.array(z.string())]).nullable(),
    isVerified: z.boolean(),
    otpCode: z.string().optional(),
    otpExpiresAt: z.string().optional(),
    isTempAccount: z.boolean(),
    isActive: z.boolean(),
    isOtpLogin: z.boolean().optional(),
    examAttempts: z.array(UserExamSchema).optional().nullable(),
    id: z.string().optional()
});

export const UserSchemaArraySchema = z.array(UserSchema);

export const UsersListParamsSchema = z.object({
    data: UserSchemaArraySchema,
    total: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    usersPerPage: z.number()
})

export const UsersFilterForm = z.object({
    login: z.string().optional(),
    email: z.string().optional(),
    role: z.string().optional(),
    groups: z.array(z.string()).nullable().optional(),
})

export const UserDeleteByIdSchema = z.object({
    message: z.string(),
    success: z.boolean()
})

export const UserGenerateMessagesSchema = z.object({
    message: z.string(),
    success: z.boolean()
})

export const UserGenerateSchema = z.object({
    count: z.string().min(1, {
        message: {
            ro: "Introduceți numărul de utilizatori de generat",
            ru: "Укажите количество пользователей для генерации",
            en: "Enter the number of users to generate",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
    baseLogin: z.string().min(1, {
        message: {
            ro: "Introduceți prefixul pentru login-urile utilizatorilor",
            ru: "Введите префикс для логинов пользователей",
            en: "Enter the prefix for user logins",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
    baseEmail: z.string().min(1, {
        message: {
            ro: "Introduceți prefixul pentru email-urile utilizatorilor",
            ru: "Введите префикс для email-ов пользователей",
            en: "Enter the prefix for user emails",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
    groups: z.array(z.string()).nullable().optional()
});


export const UserFormSchema = z.object({
    login: z.string().min(1, {
        message: {
            ro: "Introduceți loginul",
            ru: "Введите логин",
            en: "Enter login",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
    email: z
        .string()
        .min(1, {
            message: {
                ro: "Introduceți adresa de email",
                ru: "Введите email",
                en: "Enter email",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        })
        .email({
            message: {
                ro: "Introduceți o adresă de email validă",
                ru: "Введите корректный email",
                en: "Enter a valid email",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
    password: z
        .string()
        .min(5, {
            message: {
                ro: "Parola trebuie să aibă cel puțin 5 caractere",
                ru: "Пароль должен содержать не менее 5 символов",
                en: "Password must be at least 5 characters",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        })
        .regex(/[A-Z]/, {
            message: {
                ro: "Parola trebuie să conțină cel puțin o literă mare",
                ru: "Пароль должен содержать хотя бы одну заглавную букву",
                en: "Password must contain at least one uppercase letter",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        })
        .regex(/[a-z]/, {
            message: {
                ro: "Parola trebuie să conțină cel puțin o literă mică",
                ru: "Пароль должен содержать хотя бы одну строчную букву",
                en: "Password must contain at least one lowercase letter",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        })
        .regex(/[0-9]/, {
            message: {
                ro: "Parola trebuie să conțină cel puțin o cifră",
                ru: "Пароль должен содержать хотя бы одну цифру",
                en: "Password must contain at least one digit",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        })
        .regex(/[^A-Za-z0-9]/, {
            message: {
                ro: "Parola trebuie să conțină cel puțin un simbol special",
                ru: "Пароль должен содержать хотя бы один специальный символ",
                en: "Password must contain at least one special character",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
    firstName: z.string().min(1, {
        message: {
            ro: "Introduceți prenumele",
            ru: "Введите имя",
            en: "Enter first name",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
    lastName: z.string().min(1, {
        message: {
            ro: "Introduceți numele de familie",
            ru: "Введите фамилию",
            en: "Enter last name",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
    role: z.string().min(1, {
        message: {
            ro: "Selectați rolul",
            ru: "Выберите роль",
            en: "Select role",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
    groups: z.array(z.string()).nullable().optional(),
});

export const UserFormEditSchema = z.object({
    login: z.string().min(1, {
        message: {
            ro: "Introduceți loginul",
            ru: "Введите логин",
            en: "Enter login",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
    email: z
        .string()
        .min(1, {
            message: {
                ro: "Introduceți adresa de email",
                ru: "Введите email",
                en: "Enter email",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        })
        .email({
            message: {
                ro: "Introduceți o adresă de email validă",
                ru: "Введите корректный email",
                en: "Enter a valid email",
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
    firstName: z.string().min(1, {
        message: {
            ro: "Introduceți prenumele",
            ru: "Введите имя",
            en: "Enter first name",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
    lastName: z.string().min(1, {
        message: {
            ro: "Introduceți numele de familie",
            ru: "Введите фамилию",
            en: "Enter last name",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
    role: z.string().min(1, {
        message: {
            ro: "Selectați rolul",
            ru: "Выберите роль",
            en: "Select role",
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
    isActive: z.boolean(),
    groups: z.array(z.string()).optional().nullable(),
    isVerified: z.boolean()
});

export const UserFormResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    user: z.object({
        login: z.string(),
        email: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        role: z.string(),
    })
})


export type User = z.infer<typeof UserSchema>;
export type UsersListParams = z.infer<typeof UsersListParamsSchema>;
export type UsersFilter = z.infer<typeof UsersFilterForm>;
export type UserDeleteById = z.infer<typeof UserDeleteByIdSchema>;
export type UserGenerate = z.infer<typeof UserGenerateSchema>;
export type UserGenerateMessages = z.infer<typeof UserGenerateMessagesSchema>;
export type UserForm = z.infer<typeof UserFormSchema>;
export type UserFormResponse = z.infer<typeof UserFormResponseSchema>;
export type UserFormEdit = z.infer<typeof UserFormEditSchema>;
export type UserSchemaArray = z.infer<typeof UserSchemaArraySchema>;