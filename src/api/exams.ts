import { typedFetch } from "@/lib/typedFetch"
import { ExamsForm, ExamsFormSchema, ExamsResponse, ExamsResponseAttempts, ExamsResponseAttemptsSchema, ExamsResponseMessagesSchema, ExamsResponseSchema, ExamsSchema } from "@/validation/exams"

export const getExams = (
    page?: number,
): Promise<ExamsResponse> => {
    const params = new URLSearchParams()
    if (page) params.set('page', page.toString())

    return typedFetch(`/exam?${params.toString()}`, ExamsResponseSchema)
}

export const deleteExamsById = (id: string) => {
    return typedFetch(`/exam/${id}`, ExamsResponseMessagesSchema, { method: 'delete' })
}

export const createExams = (data: ExamsForm) => {
    return typedFetch(`/exam`, ExamsFormSchema, { method: 'post', data })
}

export const getExamsBySlug = (slug: string) => {
    return typedFetch(`/exam/${slug}`, ExamsSchema)
}

export const updateExams = (id: string, data: ExamsForm) => {
    return typedFetch(`/exam/${id}`, ExamsFormSchema, { method: 'patch', data })
}

export const getExamsAttempts = (
    page?: number,
): Promise<ExamsResponseAttempts> => {
    const params = new URLSearchParams()
    if (page) params.set('page', page.toString())

    return typedFetch(`/exam/attempts?${params.toString()}`, ExamsResponseAttemptsSchema)
}