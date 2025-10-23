// hooks/useAuthBootstrap.ts
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useUserStore, User } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { getProfileData } from "../api/client";

export function useAuthLog() {
    const cookie = Cookies.get("user");
    const dataUser = cookie && JSON.parse(cookie);
    const { data } = useQuery({
        queryKey: ["getProfileData", dataUser?.email],
        queryFn: () => getProfileData(dataUser!.email),
        enabled: !!dataUser?.email,
        staleTime: 0,
        gcTime: 0,
    });

    useEffect(() => {
        if (data) {
            try {
                useUserStore.getState().setUser(data as User);
            } catch {
                useUserStore.getState().setUser(null);
            }
        }
    }, [data]);
}
