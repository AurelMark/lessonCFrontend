import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: {
        ro: "Introduceți adresa de email",
        ru: "Введите email",
        en: "Enter your email",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    })
    .email({
      message: {
        ro: "Emailul nu este valid",
        ru: "Некорректный email",
        en: "Invalid email",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
  password: z
    .string()
    .min(1, {
      message: {
        ro: "Introduceți parola",
        ru: "Введите пароль",
        en: "Enter your password",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    })
    .min(5, {
      message: {
        ro: "Parola trebuie să aibă cel puțin 5 caractere",
        ru: "Пароль должен быть не менее 5 символов",
        en: "Password must be at least 5 characters",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    })
});

export const LoginOTPSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: {
        ro: "Introduceți adresa de email",
        ru: "Введите email",
        en: "Enter your email",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    })
    .email({
      message: {
        ro: "Emailul nu este valid",
        ru: "Некорректный email",
        en: "Invalid email",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    })
});

export const LoginOTPCodeSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: {
        ro: "Introduceți adresa de email",
        ru: "Введите email",
        en: "Enter your email",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    })
    .email({
      message: {
        ro: "Emailul nu este valid",
        ru: "Некорректный email",
        en: "Invalid email",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
  otpCode: z
    .string()
    .min(6, {
      message: {
        ro: "OTP Cod trebuie să aibă cel puțin 6 caractere",
        ru: "OTP Код должен быть не менее 6 символов",
        en: "OTP Code must be at least 6 characters",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    })
    .refine((val) => /^\d+$/.test(val), {
      message: {
        ro: "Codul OTP trebuie să conțină doar cifre",
        ru: "OTP Код должен содержать только цифры",
        en: "OTP Code must contain only digits",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    })
});


export const ChangePasswordSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: {
        ro: "Introduceți adresa de email",
        ru: "Введите email",
        en: "Enter your email",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    })
    .email({
      message: {
        ro: "Emailul nu este valid",
        ru: "Некорректный email",
        en: "Invalid email",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
  otpCode: z
    .string()
    .min(6, {
      message: {
        ro: "OTP Cod trebuie să aibă cel puțin 6 caractere",
        ru: "OTP Код должен быть не менее 6 символов",
        en: "OTP Code must be at least 6 characters",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    })
    .refine((val) => /^\d+$/.test(val), {
      message: {
        ro: "Codul OTP trebuie să conțină doar cifre",
        ru: "OTP Код должен содержать только цифры",
        en: "OTP Code must contain only digits",
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
    })
});

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    groups: z.array(z.object({ id: z.string() })),
    role: z.string(),
    isTempAccount: z.boolean(),
    isActive: z.boolean(),
    isVerified: z.boolean(),
    login: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional()
  }),
});

export const LoginOTPResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const VerifyOTPCodeSchema = z.object({
  login: z.string(),
  email: z.string(),
  otpCode: z.string()
});

export const ActivateAccountSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: {
        ro: "Introduceți adresa de email",
        ru: "Введите email",
        en: "Enter your email",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    })
    .email({
      message: {
        ro: "Emailul nu este valid",
        ru: "Некорректный email",
        en: "Invalid email",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
  login: z
    .string()
    .min(5, {
      message: {
        ro: "Loginul trebuie să conțină cel puțin 5 caractere",
        ru: "Логин должен содержать не менее 5 символов",
        en: "Login must be at least 5 characters",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    })
    .min(1, {
      message: {
        ro: "Introduceți loginul",
        ru: "Введите логин",
        en: "Enter your login",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
  firstName: z
    .string()
    .min(2, {
      message: {
        ro: "Prenumele trebuie să conțină cel puțin 2 caractere",
        ru: "Имя должно содержать не менее 2 символов",
        en: "First name must be at least 2 characters",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    })
    .min(1, {
      message: {
        ro: "Introduceți prenumele",
        ru: "Введите имя",
        en: "Enter your first name",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
  lastName: z
    .string()
    .min(2, {
      message: {
        ro: "Numele de familie trebuie să conțină cel puțin 2 caractere",
        ru: "Фамилия должна содержать не менее 2 символов",
        en: "Last name must be at least 2 characters",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    })
    .min(1, {
      message: {
        ro: "Introduceți numele de familie",
        ru: "Введите фамилию",
        en: "Enter your last name",
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any,
    }),
});


export type LoginFormValues = z.infer<typeof LoginSchema>;
export type LoginOTPFormValues = z.infer<typeof LoginOTPSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type LoginOTPResponse = z.infer<typeof LoginOTPResponseSchema>;
export type LoginOTPCode = z.infer<typeof LoginOTPCodeSchema>;
export type VerifyOTPCode = z.infer<typeof VerifyOTPCodeSchema>;
export type ChangePassword = z.infer<typeof ChangePasswordSchema>;
export type ActivateAccount = z.infer<typeof ActivateAccountSchema>;
