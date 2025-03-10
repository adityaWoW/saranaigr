"use client";

import { Form } from "@/app/login/formlogin";
import { SubmitButton } from "@/app/login/submit-button";
import { useState, useEffect } from "react";
import { handleLogin } from "@/app/login/server-login";
import { useRouter } from "next/navigation"; // Untuk navigasi di Next.js 13+

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const router = useRouter(); // Gunakan useRouter untuk navigasi

  useEffect(() => {
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  }, [redirectUrl, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl p-6 bg-white">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <Form
          action={async (formData: FormData) => {
            setError(null);
            const result = await handleLogin(formData);

            if (result.error) {
              setError(result.error);
            } else {
              setRedirectUrl(result.url ?? "/dashboard");
            }
          }}
        >
          <SubmitButton>Sign in</SubmitButton>
        </Form>
      </div>
    </div>
  );
}
