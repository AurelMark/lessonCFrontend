import { create } from 'zustand'

type TUseCourseFilter = {
    page: number
    setPage: (page: number) => void
}

export const useCourseFilter = create<TUseCourseFilter>((set) => ({
    page: 1,
    setPage: (page) => set(() => ({ page })),
}))
