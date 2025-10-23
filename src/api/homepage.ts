import { HomepageResponse, HomepageResponseSchema, HomepageResponseUpdateSchmea } from '@/validation/homepage';
import { typedFetch } from "@/lib/typedFetch"


export const getHomepageData = (): Promise<HomepageResponse> => {
    return typedFetch(`/homepage`, HomepageResponseSchema)
}

export const updateHomepage = (data: HomepageResponse) => {
    return typedFetch(`/homepage`, HomepageResponseUpdateSchmea, {
        method: 'patch',
        data
    })
}