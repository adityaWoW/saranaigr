"use client";

import { Form } from "@/app/login/formlogin";
import { SubmitButton } from "@/app/login/submit-button";
import { useState, useEffect } from "react";
import { handleLogin, checkAuth } from "@/app/login/server-login";
import { useRouter } from "next/navigation";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      const isAuthenticated = checkAuth();

      if (isAuthenticated) {
        console.log("Sudah login → redirect ke dashboard");
        router.replace("/dashboard");
      } else {
        console.log("Belum login → tampilkan form login");
      }

      setIsChecking(false);
    };

    verifySession();
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        Memeriksa sesi login...
      </div>
    );
  }

  const handleSubmit = async (formData: FormData) => {
    setError(null);

    const result = await handleLogin(formData);

    if ("error" in result) {
      setError(result.error || "Login gagal");
      return;
    }

    const { access_token, expiry } = result;

    if (access_token) {
      localStorage.setItem("auth_token", access_token);
      if (expiry) localStorage.setItem("auth_expiry", expiry.toString());

      console.log("Login berhasil, redirect ke dashboard...");
      await new Promise((resolve) => setTimeout(resolve, 200));
      router.replace("/dashboard");
    } else {
      setError("Token tidak valid. Silakan login ulang.");
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl p-6 bg-white">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* ✅ ubah action -> onSubmit */}
        <Form action={handleSubmit}>
          <SubmitButton>Sign in</SubmitButton>
        </Form>
      </div>
    </div>
  );
}
