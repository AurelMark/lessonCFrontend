"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { getProfileData } from "@/api/client";
import { ContentLoader } from "@/components/DashboardPanel/ContentLoader";
import UserProfileCard from "@/components/Profile/ProfileFields";
import { useSyncPageWithUrl } from "@/hooks/useSyncPageWithUrl";
import { useUserStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export default function ClientProfilePage() {
  const t = useTranslations();
  const userState = useUserStore((state) => state.user);
  useSyncPageWithUrl("contact");

  const { data, isLoading, error } = useQuery({
    queryKey: ["getProfileData", userState?.email],
    queryFn: () => getProfileData(userState!.email),
    staleTime: 0,
    gcTime: 0,
  });

  if (isLoading)
    return (
      <ContentLayout title="Profile Page">
        <ContentLoader />
      </ContentLayout>
    );

  if (error)
    return (
      <ContentLayout title="Profile Page">
        <div>{t("loadError")}</div>
      </ContentLayout>
    );

  return (
    <ContentLayout title="Profile Page">
      {data && <UserProfileCard user={data} />}
    </ContentLayout>
  );
}
