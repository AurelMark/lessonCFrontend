import { create } from 'zustand'

type TUseTagNewsFilter = {
    selectedTag: string | null
    page: number
    setTag: (tag: string | null) => void
    setPage: (page: number) => void
}

export const useTagNewsFilter = create<TUseTagNewsFilter>((set) => ({
    selectedTag: null,
    page: 1,
    setTag: (tag) =>
        set(() => ({
            selectedTag: tag,
            page: 1,
        })),
    setPage: (page) => set(() => ({ page })),
}))
