import { typedFetch } from "@/lib/typedFetch"
import { GroupsDeleteByIdSchema, GroupsForm, GroupsFormSchema, GroupsResponse, GroupsResponseSchema, GroupsSchema } from "@/validation/groups"

export const getGroups = (
    page?: number,
): Promise<GroupsResponse> => {
    const params = new URLSearchParams()
    if (page) params.set('page', page.toString())

    return typedFetch(`/group?${params.toString()}`, GroupsResponseSchema)
}

export const deleteGroupsById = (id: string) => {
    return typedFetch(`/group/${id}`, GroupsDeleteByIdSchema, { method: 'delete' })
}

export const createGroups = (data: GroupsForm) => {
    return typedFetch(`/group`, GroupsFormSchema, { method: 'post', data })
}

export const getGroupById = (slug: string) => {
    return typedFetch(`/group/${slug}`, GroupsSchema)
}

export const updateGroups = (data: GroupsForm, slug: string) => {
    return typedFetch(`/group/${slug}`, GroupsFormSchema, { method: 'patch', data })
}