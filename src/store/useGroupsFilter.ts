import { create } from 'zustand'

type TUseGroupsFilter = {
    page: number
    setPage: (page: number) => void
}

export const useGroupsFilter = create<TUseGroupsFilter>((set) => ({
    page: 1,
    setPage: (page) => set((state) => ({ ...state, page })),
}))
