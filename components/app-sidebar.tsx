import {
  Home,
  Users,
  FileText,
  ClipboardList,
  Archive,
  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LogoutButton } from "@/app/login/logoutbutton";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Master Karyawan", url: "/master-karyawan", icon: Users },
  {
    title: "Laporan Lokasi Sarana",
    url: "/laporan-lokasi-sarana",
    icon: FileText,
  },
  { title: "Rangkuman BSTS", url: "/rangkuman-bsts", icon: LayoutDashboard },
  { title: "BA - PSH", url: "/bapsh", icon: ClipboardList },
  { title: "Rincian BA - PSH", url: "/rincian-bapsh", icon: ClipboardList },
  {
    title: "Rekapitulasi Sarana Hilang",
    url: "/rekapitulasi-sarana",
    icon: Archive,
  },
  { title: "BSTS", url: "/bsts", icon: Home },
  {
    title: "Laporan Sarana Tertinggal",
    url: "/laporan-sarana-tertinggal",
    icon: ClipboardList,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r bg-white/80 backdrop-blur-md dark:bg-zinc-900/80 flex flex-col">
      {/* Header */}
      <SidebarHeader className="flex flex-col items-center gap-3 py-6 border-b border-gray-100 dark:border-zinc-800">
        <Image
          src="/logo.png"
          width={110}
          height={110}
          alt="Logo"
          className="mx-auto drop-shadow-sm"
        />
        <h1 className="text-base font-semibold tracking-wide text-center text-gray-800 dark:text-white">
          Monitoring Sarana IGR
        </h1>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="flex flex-col justify-between h-full py-5">
        {/* Menu */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-3">
              {items.map((item) => {
                const isActive = pathname === item.url;
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild>
                          <Link
                            href={item.url}
                            className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                }`}
                          >
                            <Icon
                              size={18}
                              className={`transition-transform group-hover:scale-110 ${
                                isActive ? "text-white" : ""
                              }`}
                            />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout */}
        <div className="mt-auto px-4 pb-6">
          <SidebarMenu>
            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton asChild>
                    <div
                      className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 
                      hover:bg-red-50 dark:hover:bg-red-900/20 transition cursor-pointer"
                    >
                      <LogoutButton showLabel />
                    </div>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right">Logout</TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
