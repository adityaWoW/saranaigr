"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const expiry = localStorage.getItem("auth_expiry");

    // Jika token atau expiry tidak ada → kembali ke login
    if (!token || !expiry) {
      router.push("/login");
      return;
    }
    const now = Date.now();
    if (now > Number(expiry)) {
      console.warn("Token expired, logout otomatis...");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_expiry");
      router.push("/login");
    }
  }, [router]);
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex min-h-screen w-full flex-col bg-gray-100 dark:bg-gray-900">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
