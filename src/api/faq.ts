import { typedFetch } from "@/lib/typedFetch"
import { FAQArray, FAQArrayResponse, FAQArrayResponseSchema, FAQResponseUpdateSchema } from '@/validation/faq';


export const getFAQData = (): Promise<FAQArrayResponse> => {
    return typedFetch(`/faq`, FAQArrayResponseSchema)
}

export const updateFAQ = (data: FAQArray) => {
    return typedFetch(`/faq`, FAQResponseUpdateSchema, {
        method: 'patch',
        data
    })
}