"use client";
import { useEffect, useState } from "react";
import { handleLogout } from "@/app/login/server-login";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  showLabel?: boolean;
}

export function LogoutButton({ showLabel = false }: LogoutButtonProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      onClick={handleLogout}
      className="flex items-center gap-3 cursor-pointer"
    >
      <LogOut className="h-4 w-4" />
      {showLabel && <span>Logout</span>}
    </div>
  );
}
