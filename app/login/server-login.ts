"use client";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function handleLogin(formData: FormData) {
  try {
    const payload = {
      p_kodeigr: formData.get("p_kodeigr") as string,
      p_user: formData.get("p_user") as string,
      p_password: formData.get("p_password") as string,
    };

    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Login API Error:", errText);
      return { error: "Login gagal. Periksa koneksi atau server API." };
    }

    const data = await response.json();
    console.log("Login Response:", data);

    if (data.status !== "success" || !data.data) {
      return {
        error: data.message || "Login gagal. Periksa username/password!",
      };
    }

    const token = data.data;

    // Hanya kembalikan token ke pemanggil
    return { access_token: token, expiry: Date.now() + 24 * 60 * 60 * 1000 };
  } catch (err) {
    console.error("Login Error:", err);
    return { error: "Terjadi kesalahan saat login. Coba lagi nanti." };
  }
}

export function handleLogout() {
  // Hapus semua data autentikasi
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_expiry");

  // Redirect manual ke halaman login
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export function checkAuth() {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("auth_token");
  const expiry = localStorage.getItem("auth_expiry");

  if (!token || !expiry) {
    return false;
  }

  const now = Date.now();

  // Jika token sudah kedaluwarsa
  if (now > Number(expiry)) {
    console.warn("Token expired, auto logout...");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_expiry");

    // Auto redirect logout
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return false;
  }

  return true;
}
