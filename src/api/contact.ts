import { ContactReply, GetEmailsMessageSchema, GetEmailsResponse, GetEmailsResponseSchema, replyResponseMessageSchema } from '@/validation/contact';
import { typedFetch } from "@/lib/typedFetch";

import { ContactCreate, CreateMessageResponseSchema } from "@/validation/contact";

export async function createMessageContact(payload: ContactCreate) {
    return typedFetch(
        "/contacts",
        CreateMessageResponseSchema,
        {
            method: "post",
            data: payload,
        }
    );
}

export const getEmailsList = (
    page?: number,
): Promise<GetEmailsResponse> => {
    const params = new URLSearchParams()
    if (page) params.set('page', page.toString())

    return typedFetch(`/contacts?${params.toString()}`, GetEmailsResponseSchema)
}


export const deleteEmailsById = (id: string) => {
    return typedFetch(`/contacts/${id}`, GetEmailsMessageSchema, { method: 'delete' })
}

export const replyEmailToClient = (data: ContactReply) => {
    return typedFetch(`/contacts/reply`, replyResponseMessageSchema, { method: 'post', data })
}