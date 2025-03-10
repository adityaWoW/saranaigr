import Link from "next/link";
import Image from "next/image";
import {
  LineChart,
  Package,
  PanelLeft,
  Settings,
  MonitorCheck,
  Locate,
  Users2,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Providers from "../app/dashboard/providers";
import { NavItem } from "../app/dashboard/nav-item";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav />
          </header>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}{" "}
          </main>
        </div>
      </main>
    </Providers>
  );
}

function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-28 flex-col border-r bg-white/10 backdrop-blur-md shadow-lg dark:bg-gray-900/50 sm:flex transition-all">
      <nav className="flex flex-col items-center gap-8 px-4 py-8">
        <Link href="/dashboard" className="flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Dashboard Logo"
            width={140}
            height={50}
            className="h-auto w-auto max-w-full transition-all hover:scale-110"
          />
          <span className="sr-only">Dashboard</span>
        </Link>

        <NavItem href="/tablemasteremploye" label="Master Karyawan">
          <MonitorCheck className="h-5 w-5 text-gray-700 dark:text-gray-300 transition-all hover:text-primary" />
        </NavItem>

        <NavItem href="/lokasisarana" label="Laporan Lokasi & Sarana">
          <Locate className="h-5 w-5 text-gray-700 dark:text-gray-300 transition-all hover:text-primary" />
        </NavItem>

        <NavItem href="/rangkuman" label="Rangkuman BSTS">
          <Archive className="h-5 w-5 text-gray-700 dark:text-gray-300 transition-all hover:text-primary" />
        </NavItem>
      </nav>

      <nav className="mt-auto flex flex-col items-center gap-6 px-4 py-8">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-200/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 transition-all hover:bg-gray-300/70 hover:dark:bg-gray-700/70"
            >
              <Settings className="h-8 w-8" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link href="/" className="flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Dashboard Logo"
              width={100}
              height={20}
              className="h-auto w-auto max-w-full transition-all hover:scale-110"
            />
            <span className="sr-only">logo</span>
          </Link>
          <Link
            href="/dashboard/tablemasteremploye"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <MonitorCheck className="h-5 w-5" />
            Master Karyawan
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-foreground"
          >
            <Package className="h-5 w-5" />
            Products
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Users2 className="h-5 w-5" />
            Customers
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <LineChart className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
