import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const currentTime = Math.floor(Date.now() / 1000);
  const tokenExp = token?.exp ? Number(token.exp) : 0;

  const { pathname } = req.nextUrl;

  // Jika token tidak ada atau token telah kedaluwarsa, arahkan ke /login
  if (!token || (tokenExp && currentTime >= tokenExp)) {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Jika pengguna sudah login dan mencoba mengakses /login, arahkan ke /dashboard
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"], // Middleware berlaku untuk halaman login dan dashboard
};
