"use client";

import { ContentLayout } from "@/components/DashboardPanel/ContentLayout";
import DashboardWelcome from "@/components/Dashboard/DashboardWelcome";

export default function DashboardPage() {
  return (
    <ContentLayout title="Dashboard">
      <DashboardWelcome />
    </ContentLayout>
  );
}
