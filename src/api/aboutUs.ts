import { typedFetch } from "@/lib/typedFetch"
import { AboutUsResponse, AboutUsResponseSchema, AboutUsUpdateSchema, AboutUsValidation } from "@/validation/aboutUs";


export const getAboutUsData = (): Promise<AboutUsResponse> => {
    return typedFetch(`/about-us`, AboutUsResponseSchema)
}

export const updateAboutUs = (data: AboutUsValidation) => {
    return typedFetch(`/about-us`, AboutUsUpdateSchema, {
        method: 'patch',
        data
    })
}