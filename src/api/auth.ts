// services/auth.ts
import { typedFetch } from "@/lib/typedFetch";
import { ActivateAccount, ChangePassword, LoginOTPResponseSchema, LoginResponseSchema, VerifyOTPCode } from "@/validation/login";

export type LoginPayload = {
    email: string
    password: string
};

export type LoginOTPPayload = {
    email: string
}

export type LoginOTPCodePayload = {
    email: string
    otpCode: string
}

export type ResendVerifyCode = {
    email: string
    login: string
}

export async function loginRequest(payload: LoginPayload) {
    return typedFetch(
        "/auth/login",
        LoginResponseSchema,
        {
            method: "post",
            data: payload,
        }
    );
}

export async function loginOTPRequest(payload: LoginOTPPayload) {
    return typedFetch(
        "/auth/request-otp",
        LoginOTPResponseSchema,
        {
            method: "post",
            data: payload,
        }
    );
}

export async function loginOTPCode(payload: LoginOTPCodePayload) {
    return typedFetch(
        "/auth/login-otp",
        LoginResponseSchema,
        {
            method: "post",
            data: payload,
        }
    );
}

export async function verifyOTPCode(data: VerifyOTPCode) {
    return typedFetch(
        "/user/verify",
        LoginOTPResponseSchema,
        {
            method: "post",
            data
        }
    );
}
export async function resendVerifyOTPCode(data: ResendVerifyCode) {
    return typedFetch(
        "/user/resend-otp",
        LoginOTPResponseSchema,
        {
            method: "post",
            data
        }
    );
}


export async function forgotPasswordRequest(payload: LoginOTPPayload) {
    return typedFetch(
        "/user/forgot-password",
        LoginOTPResponseSchema,
        {
            method: "post",
            data: payload,
        }
    );
}

export async function changePasswordRequest(payload: ChangePassword) {
    return typedFetch(
        "/user/reset-password",
        LoginOTPResponseSchema,
        {
            method: "post",
            data: payload,
        }
    );
}

export async function activateAccountRequest(data: ActivateAccount, id: string) {
    return typedFetch(
        `/user/profile/${id}`,
        LoginOTPResponseSchema,
        {
            method: "patch",
            data: data,
        }
    );
}

export const logOutFromSystem = () => {
    return typedFetch(
        `/auth/logout`,
        LoginOTPResponseSchema,
    );
}