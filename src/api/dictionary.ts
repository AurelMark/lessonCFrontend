import { typedFetch } from "@/lib/typedFetch"
import { ExamsArraySchema } from "@/validation/exams"
import { GroupsListSchema } from "@/validation/groups"
import { LessonArraySchemaZod } from "@/validation/lesson"
import { UserSchemaArraySchema } from "@/validation/users"

export const getDictionaryLessons = () => {
    return typedFetch(`/dictionary/get-lessons`, LessonArraySchemaZod)
}

export const getDictionaryGroups = () => {
    return typedFetch(`/dictionary/get-groups`, GroupsListSchema)
}

export const getDictionaryUsers = () => {
    return typedFetch(`/dictionary/get-users`, UserSchemaArraySchema)
}

export const getDictionaryExams = () => {
    return typedFetch(`/dictionary/get-exams`, ExamsArraySchema)
}