import DashboardLayout from "@/components/dashboardlayout";
import Providers from "./providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <DashboardLayout>{children}</DashboardLayout>
    </Providers>
  );
}
