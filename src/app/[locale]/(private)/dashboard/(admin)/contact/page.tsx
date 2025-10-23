"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { getEmailsList } from "@/api/contact";
import ContactsList from "@/components/Admin/Contact/AdminContact";
import CustomPagination from "@/custom/CustomPagination";
import { ContentLoader } from "@/components/DashboardPanel/ContentLoader";
import { useSyncPageWithUrl } from "@/hooks/useSyncPageWithUrl";
import { useContactStore } from "@/store/useContactFilter";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export default function AdminGroupsPage() {
  const t = useTranslations();
  const { page, setPage } = useContactStore();
  useSyncPageWithUrl("contact");

  const { data, isLoading, error } = useQuery({
    queryKey: ["contactsEmail", page],
    queryFn: () => getEmailsList(page),
    staleTime: 0,
    gcTime: 0,
  });

  if (isLoading)
    return (
      <ContentLayout title="Contacts">
        <ContentLoader />
      </ContentLayout>
    );

  if (error)
    return (
      <ContentLayout title="Contacts">
        <div>{t("loadError")}</div>
      </ContentLayout>
    );

  return (
    <ContentLayout title="Contacts">
      {data && (
        <div className="flex flex-col gap-4">
          <ContactsList data={data.data} />
          <CustomPagination
            currentPage={data.currentPage}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </ContentLayout>
  );
}
