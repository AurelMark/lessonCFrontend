"use client";
import { LANG_TYPE } from "@/types";
import { User } from "@/validation/users";
import { CheckCircle, XCircle } from "lucide-react";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";
import { Button } from "@/componentsUI/button";
import { ProfileChangePasswordModals } from "./ProfileModals";
import { useState } from "react";

type TUserProfileCardProps = {
  user: User;
};

function UserField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center">
      <span className="font-medium min-w-[200px]">{label}:</span>
      <span className="break-all ml-0 sm:ml-2">{value}</span>
    </div>
  );
}

function BoolIcon({ value }: { value: boolean }) {
  return value ? (
    <CheckCircle
      className="inline-block text-green-500 w-5 h-5"
      aria-label="yes"
    />
  ) : (
    <XCircle className="inline-block text-red-500 w-5 h-5" aria-label="no" />
  );
}

export default function UserProfileCard({ user }: TUserProfileCardProps) {
  const locale = useLocale() as LANG_TYPE;
  const t = useTranslations("profile");
  const [openModals, setOpenModals] = useState(false);
  const toggleModals = () => setOpenModals((oldState) => !oldState);

  return (
    <>
      <div className="max-w-md mx-auto bg-background shadow-md rounded-xl p-6 my-8 space-y-8 sm:max-w-full">
        <h2 className="text-xl font-bold text-center mb-2">{t("title")}</h2>
        <div className="space-y-3">
          <UserField label={t("email")} value={user.email} />
          {user.login && <UserField label={t("login")} value={user.login} />}
          <UserField
            label={t("fullname")}
            value={`${user.firstName} ${user.lastName}` || ""}
          />
          <UserField label={t("role")} value={user.role} />
          <UserField label={t("id")} value={user.id || ""} />
          <UserField
            label={t("groups")}
            value={
              Array.isArray(user.groups) && user.groups.length
                ? user.groups
                    .map((g) =>
                      typeof g === "string" ? g : g.title?.[locale] || g.id
                    )
                    .join(", ")
                : t("noGroups")
            }
          />
          <UserField
            label={t("tempAccount")}
            value={<BoolIcon value={user.isTempAccount} />}
          />
          <UserField
            label={t("active")}
            value={<BoolIcon value={user.isActive} />}
          />
          <UserField
            label={t("verified")}
            value={<BoolIcon value={user.isVerified} />}
          />
          <div className="flex justify-center gap-4">
            <Button variant="secondary" onClick={toggleModals}>
              {t("changePassword")}
            </Button>
          </div>
        </div>
      </div>
      <ProfileChangePasswordModals
        data={{ login: user.login, email: user.email }}
        open={openModals}
        onOpenChange={toggleModals}
      />
    </>
  );
}
