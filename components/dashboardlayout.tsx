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
      <main className="flex min-h-screen w-full flex-col bg-muted/30">
        <DesktopNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-56">
          {" "}
          {}
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-white/70 shadow-md backdrop-blur-md px-6 sm:static sm:h-auto sm:border-0 sm:bg-transparent">
            <MobileNav />
          </header>
          <main className="grid flex-1 items-start gap-4 p-6 bg-muted/40 rounded-lg">
            {children}
          </main>
        </div>
      </main>
    </Providers>
  );
}

function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-56 flex-col border-r bg-white/10 backdrop-blur-md shadow-lg dark:bg-gray-900/50 sm:flex transition-all">
      <nav className="flex flex-col items-center gap-6 px-6 py-8">
        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-2 transition-transform hover:scale-105"
        >
          <Image
            src="/logo.png"
            alt="Dashboard Logo"
            width={120}
            height={50}
            priority
          />
          <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
            Monitoring Sarana
          </span>
        </Link>

        <NavItem href="/tablemasteremploye" label="Master Karyawan">
          <MonitorCheck className="h-6 w-6 text-gray-700 dark:text-gray-300 transition-colors hover:text-primary" />
        </NavItem>

        <NavItem href="/laporanlokasidansarana" label="Laporan Lokasi & Sarana">
          <Locate className="h-6 w-6 text-gray-700 dark:text-gray-300 transition-colors hover:text-primary" />
        </NavItem>

        <NavItem href="/rangkumanbsts" label="Rangkuman BSTS">
          <Archive className="h-6 w-6 text-gray-700 dark:text-gray-300 transition-colors hover:text-primary" />
        </NavItem>
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
          <PanelLeft className="h-6 w-6 text-gray-600" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="sm:max-w-xs p-6 bg-white/80 backdrop-blur-md rounded-r-lg shadow-lg"
      >
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/"
            className="flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105"
          >
            <Image
              src="/logo.png"
              alt="Dashboard Logo"
              width={80}
              height={30}
            />
          </Link>
          <Link
            href="/tablemasteremploye"
            className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-200"
          >
            <MonitorCheck className="h-5 w-5" />
            Master Karyawan
          </Link>
          <Link
            href="/laporanlokasidansarana"
            className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-200"
          >
            <Locate className="h-5 w-5" />
            Laporan Lokasi & Sarana
          </Link>
          <Link
            href="/rangkumanbsts"
            className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-200"
          >
            <Archive className="h-5 w-5" />
            Rangkuman BSTS
          </Link>
          <div className="mt-4 flex items-center justify-center">
            <LogoutButton />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
