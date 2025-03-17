"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavItem({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={clsx(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8",
            {
              "bg-accent text-black font-medium": isActive,
            }
          )}
        >
          {children}
          <span className="text-sm hidden md:inline">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
