import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";

const items = [
  {
    title: "Master Karyawan",
    url: "/master-karyawan",
    icon: Home
  },
  {
    title: "Laporan Lokasi Sarana",
    url: "/laporan-lokasi-sarana",
    icon: Home
  },
  {
    title: "Rangkuman BSTS",
    url: "/rangkuman-bsts",
    icon: Home
  },
  {
    title: "BA - PSH",
    url: "/bapsh",
    icon: Home
  },
  {
    title: "Rincian BA - PSH",
    url: "/rincian-bapsh",
    icon: Home
  },
  {
    title: "Rekapitulasi Sarana Hilang",
    url: "/rekapitulasi-sarana",
    icon: Home
  },
  {
    title: "BSTS",
    url: "/bsts",
    icon: Home
  }
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center">
        <h1 className="text-xl font-bold">Monitoring Sarana IGR</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}