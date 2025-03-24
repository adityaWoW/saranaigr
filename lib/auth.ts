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
    maxAge: 6 * 60 * 60, // 6 jam
  },
  jwt: {
    maxAge: 6 * 60 * 60, // 6 jam
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.exp = Math.floor(Date.now() / 1000) + 6 * 60 * 60; // Set waktu kedaluwarsa token
      }
      return token;
    },
    async session({ session, token }) {
      const tokenExp = typeof token.exp === "number" ? token.exp : 0;

      if (!token || (tokenExp && Date.now() / 1000 > tokenExp)) {
        return { ...session, user: undefined };
      }

      return {
        ...session,
        user: {
          name: token.id ? String(token.id) : "",
        },
      };
    },
  },
};
