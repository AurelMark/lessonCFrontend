import { z } from "zod";

export const ContactCreateSchema = z.object({
    id: z.string().optional(),
    firstName: z
        .string()
        .min(1, {
            message: {
                ro: "Introduceți prenumele",
                ru: "Введите имя",
                en: "Enter your first name",
            } as any, // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
    lastName: z
        .string()
        .min(1, {
            message: {
                ro: "Introduceți numele de familie",
                ru: "Введите фамилию",
                en: "Enter your last name",
            } as any, // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
    email: z
        .string()
        .min(1, {
            message: {
                ro: "Introduceți adresa de email",
                ru: "Введите email",
                en: "Enter your email address",
            } as any, // eslint-disable-line @typescript-eslint/no-explicit-any,
        })
        .email({
            message: {
                ro: "Emailul nu este valid",
                ru: "Некорректный email",
                en: "Invalid email address",
            } as any, // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
    phone: z
        .string()
        .min(5, {
            message: {
                ro: "Introduceți numărul de telefon (minim 5 caractere)",
                ru: "Введите номер телефона (не менее 5 символов)",
                en: "Enter your phone number (at least 5 characters)",
            } as any, // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
    message: z
        .string()
        .min(10, {
            message: {
                ro: "Mesajul trebuie să aibă cel puțin 10 caractere",
                ru: "Сообщение должно содержать не менее 10 символов",
                en: "Message must be at least 10 characters",
            } as any, // eslint-disable-line @typescript-eslint/no-explicit-any,
        }),
});

export const CreateMessageResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});

export const GetEmailsSchema = z.object({
    id: z.string().optional(),
    firstName: z.string(),
    lastName: z.string(),
    message: z.string(),
    phone: z.string(),
    email: z.string(),
    isReply: z.boolean().optional()
});

export const GetEmailsArraySchema = z.array(GetEmailsSchema);

export const GetEmailsResponseSchema = z.object({
    data: GetEmailsArraySchema,
    total: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    contactsPerPage: z.number()
});

export const GetEmailsMessageSchema = z.object({
    message: z.string()
})

export const replyResponseMessageSchema = z.object({
    message: z.string(),
    success: z.boolean()
})

export const ContactReplySchema = z.object({
    id: z.string().optional(),
    fullName: z
        .string(),
    email: z
        .string(),
    phone: z
        .string(),
    message: z
        .string(),
    subject: z.string()
});

export type ContactCreate = z.infer<typeof ContactCreateSchema>;
export type CreateMessageResponse = z.infer<typeof CreateMessageResponseSchema>;
export type GetEmails = z.infer<typeof GetEmailsSchema>;
export type GetEmailsArray = z.infer<typeof GetEmailsArraySchema>;
export type GetEmailsResponse = z.infer<typeof GetEmailsResponseSchema>;
export type GetEmailsMessage = z.infer<typeof GetEmailsMessageSchema>;
export type replyResponseMessage = z.infer<typeof replyResponseMessageSchema>;
export type ContactReply = z.infer<typeof ContactReplySchema>;
