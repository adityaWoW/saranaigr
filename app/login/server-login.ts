"use client";
import { signIn, signOut } from "next-auth/react";

export async function handleLogin(formData: FormData) {
  const result = await signIn("credentials", {
    redirect: false,
    id: formData.get("id") as string,
    password: formData.get("password") as string,
    callbackUrl: "/dashboard",
  });

  if (result?.error) {
    return { error: "Login gagal. Periksa ID dan Password!" };
  }

  if (result?.url) {
    window.location.href = result.url;

    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/dashboard");
    }
  }

  return { success: true };
}

export function handleLogout() {
  signOut({ callbackUrl: "/login" });

  if (typeof window !== "undefined") {
    window.history.replaceState(null, "", "/login");
  }
}
