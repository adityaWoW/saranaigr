"use client";
import { useEffect, useState } from "react";
import { handleLogout } from "@/app/login/server-login";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      onClick={handleLogout}
      className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500 text-white transition-all hover:bg-red-600"
    >
      <LogOut className="h-3 w-3" />
      <span className="sr-only">Logout</span>
    </Button>
  );
}
