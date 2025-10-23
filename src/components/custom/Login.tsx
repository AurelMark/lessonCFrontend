"use client";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/componentsUI/button";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/componentsUI/tooltip";
import { useTranslations } from "next-intl";
import { useUserStore } from "@/store/useAuthStore";
import { logOutSystem } from "@/lib/utils";
import { toast } from "sonner";

export default function LoginComponent() {
  const t = useTranslations();

  const useUserStoreState = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const isLogged = !!(
    useUserStoreState && Object.values(useUserStoreState).length > 0
  );

  const handleLoginSystem = async () => {
    await logOutSystem();
    setUser(null);
    toast.success(t("logout_success"));
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {!isLogged ? (
            <Button asChild variant="outline">
              <Link href="/login" aria-label={t("login")}>
                <LogIn />
                <span className="sr-only">{t("login")}</span>
              </Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleLoginSystem}
              aria-label={t("logout")}
            >
              <LogOut />
              <span className="sr-only">{t("logout")}</span>
            </Button>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{isLogged ? t("logout") : t("login")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
