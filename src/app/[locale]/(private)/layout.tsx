import DashboardPanelLayout from "@/components/DashboardPanel/DashboardLayout";
import { AuthLog } from "@/custom/Auth";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardPanelLayout>
      <AuthLog />
      {children}
    </DashboardPanelLayout>
  );
}
