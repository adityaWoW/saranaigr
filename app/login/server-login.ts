import { signIn } from "next-auth/react";

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

  return { success: true, url: result?.url ?? "/dashboard" };
}
