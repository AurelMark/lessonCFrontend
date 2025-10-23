import { typedFetch } from "@/lib/typedFetch"
import { ChangePasswordData } from "@/validation/client";
import { LoginOTPResponseSchema } from "@/validation/login";
import { UserSchema } from "@/validation/users";
import { LessonListParams, LessonListParamsSchema, LessonSchemaZod } from "@/validation/lesson";
import { ExamsResponse, ExamsResponseSchema, ExamsSchema, SubmitExam, SubmitExamResponseSchema } from "@/validation/exams";


export const getProfileData = (email: string) => {
    return typedFetch(`/client/get-profile?email=${email}`, UserSchema)
}

export const changePassword = (data: ChangePasswordData) => {
    return typedFetch(`/client/change-password`, LoginOTPResponseSchema, { method: 'post', data })
}

export const getLessonsByGroups = (
    page?: number,
): Promise<LessonListParams> => {
    const params = new URLSearchParams()
    if (page) params.set('page', page.toString())

    return typedFetch(`/client/lesson?${params.toString()}`, LessonListParamsSchema)
}

export const getLessonBySlugClient = (slug: string) => {
    return typedFetch(`/client/lesson/${slug}`, LessonSchemaZod)
}

export const getExamsByGroups = (
    page?: number,
): Promise<ExamsResponse> => {
    const params = new URLSearchParams()
    if (page) params.set('page', page.toString())

    return typedFetch(`/client/exam?${params.toString()}`, ExamsResponseSchema)
}

export const getExamsBySlug = (slug: string) => {
    return typedFetch(`/client/exam/${slug}`, ExamsSchema)
}

export const submitAnswers = (data: SubmitExam) => {
    console.log('data', data)
    return typedFetch(`/exam/submit`, SubmitExamResponseSchema, { method: 'post', data })
}