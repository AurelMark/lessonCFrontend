import { create } from 'zustand'

type TUseUploadsStoreProps = {
    open: boolean;
    setOpen: (state: boolean) => void;
    url: string;
    setUrl: (state: string) => void;
    reset: () => void;
    type: 'private' | 'public' | '';
    setType: (state: 'private' | 'public' | '') => void;
    selectedUrl: string | null;
    setSelectedUrl: (url: string | null) => void;
}

export const useUploadsStore = create<TUseUploadsStoreProps>((set) => ({
    open: false,
    setOpen: (value: boolean) => set((state) => ({ ...state, open: value })),
    url: '',
    selectedUrl: null,
    setUrl: (value: string) => set((state) => ({ ...state, url: value })),
    type: '',
    setType: (value: 'private' | 'public' | '') => set((state) => ({ ...state, type: value })),
    reset: () => set((state) => ({ ...state, url: '', type: '', open: false, })),
    setSelectedUrl: (selectedUrl) => set({ selectedUrl }),
}))
