"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import { getAllUsers } from "@/api/users";
import { AdminUsersCreateUsers } from "@/components/Admin/Users/AdminUsersCreateUsers";
import { AdminUsersList } from "@/components/Admin/Users/AdminUsersList";
import { AdminUsersListFilter } from "@/components/Admin/Users/AdminUsersListFilter";
import CustomPagination from "@/custom/CustomPagination";
import { ContentLoader } from "@/components/DashboardPanel/ContentLoader";
import { Button } from "@/componentsUI/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/componentsUI/tooltip";
import { useUserFilter } from "@/store/useUserStore";
import { useQuery } from "@tanstack/react-query";
import { FilterIcon, FunnelX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function AdminUserPage() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const onOpenChange = () => setOpen((oldState) => !oldState);
  const onOpenUserChange = () => setOpenUser((oldState) => !oldState);
  const setPage = useUserFilter((state) => state.setPage);
  const setFields = useUserFilter((state) => state.setFields);
  const page = useUserFilter((state) => state.page);
  const login = useUserFilter((state) => state.login);
  const email = useUserFilter((state) => state.email);
  const role = useUserFilter((state) => state.role);
  const groups = useUserFilter((state) => state.groups);

  const valuesFilter = login || email || role || (groups && groups.length > 0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", page, email, groups, login, role],
    queryFn: () => getAllUsers({ page, email, groups, login, role }),
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (!isLoading && data && data.data && data.data.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [isLoading, data, page, setPage]);

  if (isLoading)
    return (
      <ContentLayout title="Users">
        <ContentLoader />
      </ContentLayout>
    );
  if (error)
    return (
      <ContentLayout title="Users">
        <div>{t("loadError")}</div>
      </ContentLayout>
    );

  const handleReset = () => {
    setFields({
      email: "",
      groups: [],
      login: "",
      role: "",
    });
  };

  return (
    <ContentLayout title="Users">
      <AdminUsersListFilter open={open} onOpenChange={onOpenChange} />
      <div className="flex justify-end mb-4 gap-2">
        {valuesFilter && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleReset}>
                  <FunnelX className="text-red-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("dashboard.adminUsers.resetFilter")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onOpenChange}>
                <FilterIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("dashboard.adminUsers.searchByFilter")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button onClick={onOpenUserChange}>
          {t("dashboard.adminUsers.createUser")}
        </Button>
      </div>
      {data && (
        <div className="flex flex-col gap-4">
          <AdminUsersList data={data.data} />
          <CustomPagination
            currentPage={data.currentPage}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
      <AdminUsersCreateUsers open={openUser} onOpenChange={onOpenUserChange} />
    </ContentLayout>
  );
}
