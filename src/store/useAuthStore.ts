import { create } from "zustand";

export type UserGroup = {
    id: string;
};

export type User = {
    id: string;
    email: string;
    role: string;
    groups: UserGroup[];
    isActive: boolean,
    isTempAccount: boolean,
    isVerified: boolean,
    login: string;
    firstName?: string;
    lastName?: string;
};

type UserStore = {
    user: User | null;
    setUser: (user: User | null) => void;
};

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));
