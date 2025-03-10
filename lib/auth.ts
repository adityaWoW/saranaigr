import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { getUser } from "@/lib/db";

export const authConfig: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
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
};
