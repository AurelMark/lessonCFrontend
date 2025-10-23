import { create } from 'zustand'

type TUseContactLogsStore = {
    page: number
    setPage: (page: number) => void
}

export const useContactStore = create<TUseContactLogsStore>((set) => ({
    page: 1,
    setPage: (page) => set((state) => ({ ...state, page })),
}))
