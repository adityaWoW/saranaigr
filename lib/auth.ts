import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { getUser } from "@/lib/db";

export const authConfig: NextAuthOptions = {
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60, // 24 jam dalam detik
  },
  jwt: {
    maxAge: 12 * 60 * 60, // 24 jam dalam detik
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        id: { label: "ID", type: "text", placeholder: "Masukkan ID Anda" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.id || !credentials?.password) {
          throw new Error("ID dan Password harus diisi");
        }
        const user = await getUser(credentials.id, credentials.password);

        if (!user) {
          throw new Error("ID atau Password salah");
        }

        return { id: user.id, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      token.exp = Math.floor(Date.now() / 1000) + 12 * 60 * 60; // Set token kadaluwarsa 24 jam dari sekarang
      return token;
    },
  },
};
