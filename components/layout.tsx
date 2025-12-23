import DashboardLayout from "@/components/layout/dashboardlayout";
import Providers from "./providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <DashboardLayout>{children}</DashboardLayout>
    </Providers>
  );
}
