import { create } from 'zustand'

type TUseHistoryLogsStore = {
    page: number
    setPage: (page: number) => void
}

export const useHistoryLogsStore = create<TUseHistoryLogsStore>((set) => ({
    page: 1,
    setPage: (page) => set((state) => ({ ...state, page })),
}))
