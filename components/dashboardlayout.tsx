import Link from "next/link";
import Image from "next/image";
import { LogoutButton } from "@/app/login/logoutbutton";
import { PanelLeft, MonitorCheck, Locate, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Providers from "./providers";
import { NavItem } from "../app/dashboard/nav-item";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-gray-100 dark:bg-gray-900">
        <DesktopNav />
        <div className="flex flex-col sm:gap-6 sm:py-6 sm:pl-64">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-6 border-b bg-white/80 shadow-lg backdrop-blur-md px-6 sm:static sm:h-auto sm:border-0 sm:bg-transparent">
            <MobileNav />
          </header>
          <section className="grid flex-1 items-start gap-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            {children}
          </section>
        </div>
      </main>
    </Providers>
  );
}

function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r bg-white dark:bg-gray-900 shadow-xl sm:flex transition-all">
      <nav className="flex flex-col items-center gap-8 px-8 py-8">
        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-3 transition-transform hover:scale-105"
        >
          <Image
            src="/logo.png"
            alt="Dashboard Logo"
            width={140}
            height={60}
            priority
          />
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Monitoring Sarana
          </span>
        </Link>

        {menuItems.map((item) => (
          <NavItem key={item.href} href={item.href} label={item.label}>
            {item.icon}
          </NavItem>
        ))}
      </nav>

      <nav className="mt-auto flex flex-col items-center gap-6 px-6 py-8">
        <Tooltip>
          <TooltipTrigger asChild>
            <LogoutButton />
          </TooltipTrigger>
          <TooltipContent side="right">Logout</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className="sm:hidden">
          <PanelLeft className="h-7 w-7 text-gray-700 dark:text-gray-300" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="sm:max-w-xs p-6 bg-white dark:bg-gray-800 backdrop-blur-md rounded-r-xl shadow-xl"
      >
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/"
            className="flex flex-col items-center justify-center gap-3 transition-transform hover:scale-105"
          >
            <Image
              src="/logo.png"
              alt="Dashboard Logo"
              width={90}
              height={40}
            />
          </Link>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          <div className="mt-6 flex items-center justify-center">
            <LogoutButton />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

const menuItems = [
  {
    href: "/master-karyawan",
    label: "Master Karyawan",
    icon: (
      <MonitorCheck className="h-6 w-6 text-gray-700 dark:text-gray-300 transition-colors hover:text-primary" />
    ),
  },
  {
    href: "/laporan-lokasi-sarana",
    label: "Laporan Lokasi & Sarana",
    icon: (
      <Locate className="h-6 w-6 text-gray-700 dark:text-gray-300 transition-colors hover:text-primary" />
    ),
  },
  {
    href: "/rangkuman-bsts",
    label: "Rangkuman BSTS",
    icon: (
      <Archive className="h-6 w-6 text-gray-700 dark:text-gray-300 transition-colors hover:text-primary" />
    ),
  },
  {
    href: "/rekapitulasi-sarana",
    label: "Rekapitulasi Sarana Hilang",
    icon: (
      <Archive className="h-6 w-6 text-gray-700 dark:text-gray-300 transition-colors hover:text-primary" />
    ),
  },
  {
    href: "/bapsh",
    label: "BA - PSH",
    icon: (
      <Archive className="h-6 w-6 text-gray-700 dark:text-gray-300 transition-colors hover:text-primary" />
    ),
  },
  {
    href: "/rincian-bapsh",
    label: "Rincian BA - PSH",
    icon: (
      <Archive className="h-6 w-6 text-gray-700 dark:text-gray-300 transition-colors hover:text-primary" />
    ),
  },
];
