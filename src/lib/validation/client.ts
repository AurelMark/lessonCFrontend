import { z } from "zod";

export const ChangePasswordDataSchema = z.object({
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
    newPassword: z
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
});

export type ChangePasswordData = z.infer<typeof ChangePasswordDataSchema>;