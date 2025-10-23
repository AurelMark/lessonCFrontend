import { typedFetch } from "@/lib/typedFetch"
import { UserDeleteByIdSchema, UserForm, UserFormEdit, UserFormResponseSchema, UserGenerate, UserGenerateMessagesSchema, UserSchema, UsersListParamsSchema } from "@/validation/users"

type TGetAllUsersParams = {
    login: string | null
    email: string | null
    page: number
    role: string | null
    groups: string[] | null
}

type TActivateUserStatus = {
    id: string
    activate: boolean
}


export const getAllUsers = (params: TGetAllUsersParams) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
                value.forEach(v => searchParams.append(key, v));
            } else {
                searchParams.append(key, String(value));
            }
        }
    });

    const queryString = searchParams.toString();
    return typedFetch(`/user?${queryString}`, UsersListParamsSchema)
}

export const deleteUserById = (id: string) => {
    return typedFetch(`/user/${id}`, UserDeleteByIdSchema, { method: 'delete' })
}

export const generateUsers = (data: UserGenerate) => {
    return typedFetch(`/user/generate`, UserGenerateMessagesSchema, { method: 'post', data })
}

export const createUsers = (data: UserForm) => {
    return typedFetch(`/user`, UserFormResponseSchema, { method: 'post', data })
}

export const getUserById = (id: string) => {
    return typedFetch(`/user/${id}`, UserSchema, { method: 'get' })
}

export const editUserById = (id: string, data: UserFormEdit) => {
    return typedFetch(`/user/${id}`, UserSchema, { method: 'patch', data })
}

export const forgotPassword = (email: string) => {
    return typedFetch(`/user/forgot-password`, UserGenerateMessagesSchema, { method: 'post', data: { email } })
}

export const activateUser = ({ id, activate }: TActivateUserStatus) => {
    return typedFetch(`/user/${id}/activate`, UserSchema, { method: 'patch', data: { activate } })
}