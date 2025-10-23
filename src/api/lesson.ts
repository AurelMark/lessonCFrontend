import { LessonDeleteByIdSchema, LessonForm, LessonFormSchema, LessonListParams, LessonListParamsSchema, LessonSchemaZod } from "@/validation/lesson"
import { typedFetch } from "@/lib/typedFetch"

export const getLessonAdmin = (
    page?: number,
): Promise<LessonListParams> => {
    const params = new URLSearchParams()
    if (page) params.set('page', page.toString())

    return typedFetch(`/lesson?${params.toString()}`, LessonListParamsSchema)
}

export const deleteLessonById = (id: string) => {
    return typedFetch(`/lesson/${id}`, LessonDeleteByIdSchema, { method: 'delete' })
}

export const createLesson = (data: LessonForm) => {
    return typedFetch(`/lesson`, LessonFormSchema, { method: 'post', data })
}

export const editLesson = (data: LessonForm, id: string) => {
    return typedFetch(`/lesson/${id}`, LessonFormSchema, { method: 'patch', data })
}

export const getLessonBySlug = (slug: string) => {
    return typedFetch(`/lesson/${slug}`, LessonSchemaZod)
}


