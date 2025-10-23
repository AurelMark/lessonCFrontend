import { create } from 'zustand'

type TUserFields = { login: string | null, email: string | null, role: string | null, groups: string[] | null }

type TUseUserFilter = {
    login: string | null
    email: string | null
    role: string | null
    groups: string[] | null
    page: number
    setFields: (data: TUserFields) => void
    setPage: (page: number) => void
}

export const useUserFilter = create<TUseUserFilter>((set) => ({
    login: null,
    email: null,
    role: null,
    groups: null,
    page: 1,
    setFields: (data) => set((state) => ({ ...state, ...data })),
    setPage: (page) => set((state) => ({ ...state, page })),
}))
