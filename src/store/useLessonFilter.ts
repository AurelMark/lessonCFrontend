import { create } from 'zustand'

type TUseLessonFilter = {
    page: number
    setPage: (page: number) => void
}

export const useLessonFilter = create<TUseLessonFilter>((set) => ({
    page: 1,
    setPage: (page) => set(() => ({ page })),
}))
