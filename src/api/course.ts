import { typedFetch } from '@/lib/typedFetch'
import { CourseListParamsSchema, CourseListParams, CourseSlugSchema, CourseDeleteByIdSchema, CourseForm, CourseFormSchema, SubcourseForm, SubCoursesSchema, } from '@/validation/course'

export const getCourse = (
    page?: number,
): Promise<CourseListParams> => {
    const params = new URLSearchParams()
    if (page) params.set('page', page.toString())

    return typedFetch(`/course?${params.toString()}`, CourseListParamsSchema)
}

export const getCourseBySlug = (slug: string) => {
    return typedFetch(`/course/slug/${slug}`, CourseSlugSchema)
}

export const deleteCourseById = (id: string) => {
    return typedFetch(`/course/${id}`, CourseDeleteByIdSchema, { method: 'delete' })
}

export const createCourse = (data: CourseForm) => {
    return typedFetch(`/course`, CourseFormSchema, { method: 'post', data })
}

export const editCourse = (data: CourseForm, id: string) => {
    return typedFetch(`/course/${id}`, CourseFormSchema, { method: 'patch', data })
}

export const deleteSubCourseById = (slug: string, id: string) => {
    return typedFetch(`/course/slug/${slug}/subcourses/${id}`, CourseDeleteByIdSchema, { method: 'delete' })
}

export const createSubcourse = (data: SubcourseForm, courseSlug: string,) => {
    return typedFetch(`/course/slug/${courseSlug}/subcourses`, SubCoursesSchema, { method: 'post', data })
}

export const getSubcourseById = (slug: string, id: string) => {
    return typedFetch(`/course/slug/${slug}/subcourses/${id}`, SubCoursesSchema)
}

export const editSubcourse = (data: SubcourseForm, courseSlug: string, id: string) => {
    return typedFetch(`/course/slug/${courseSlug}/subcourses/${id}`, SubCoursesSchema, { method: 'patch', data })
}