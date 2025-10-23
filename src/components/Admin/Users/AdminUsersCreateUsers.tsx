import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/componentsUI/dialog";
import { Button } from "@/componentsUI/button";
import { useLocale, useTranslations } from "next-intl";
import { Bot, Hand } from "lucide-react";
import { LANG_TYPE } from "@/types";
import { useRouter } from "next/navigation";

type TAdminUsersCreateUsersProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
};

export const AdminUsersCreateUsers = ({
  open,
  onOpenChange,
}: TAdminUsersCreateUsersProps) => {
  const t = useTranslations();
  const locale = useLocale() as LANG_TYPE;
  const router = useRouter();

  const handleRedirectToGenerate = () =>
    router.push(`/${locale}/dashboard/users/generate`);
  const handleRedirectToCreate = () =>
    router.push(`/${locale}/dashboard/users/create`);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-8">
        <DialogHeader>
          <DialogTitle className="mb-4">
            {t("dashboard.adminUsers.createUser")}
          </DialogTitle>
          <DialogDescription asChild>
            <ul className="list-disc list-inside space-y-4">
              <li>{t("dashboard.adminUsers.autoModeDescription")}</li>
              <li>{t("dashboard.adminUsers.manualModeDescription")}</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={handleRedirectToGenerate}>
            <Bot className="text-lime-500" />
            {t("dashboard.adminUsers.autoMode")}
          </Button>
          <Button variant="outline" onClick={handleRedirectToCreate}>
            <Hand className="text-orange-500" />
            {t("dashboard.adminUsers.manualMode")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
