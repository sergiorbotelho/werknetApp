import { api } from "@/services/api/api";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "crendencials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        const response = await api.post("/session", {
          email: credentials?.email,
          password: credentials?.password,
        });

        const user = response.data;

        if (user) {
          return user;
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },

  callbacks: {
    jwt: async ({ token, user }) => {
      const customers = user as unknown as any;

      if (user) {
        return {
          ...token,
          token: customers.token,
          id: customers.sub,
        };
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.sub as string; // Adiciona a propriedade `id`
      session.user.token = token.token as string; // Adiciona o token à sessão
      return session;
    },
  },
};
const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST, nextAuthOptions };
