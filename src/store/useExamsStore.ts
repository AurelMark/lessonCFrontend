import { create } from 'zustand'

type TUseExamsStore = {
    page: number
    setPage: (page: number) => void
}

export const useExamsStore = create<TUseExamsStore>((set) => ({
    page: 1,
    setPage: (page) => set((state) => ({ ...state, page })),
}))
