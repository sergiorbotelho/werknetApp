import { UserRole } from "@/types/user";
import axios, { isAxiosError } from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface SessionResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  mustChangePassword: boolean;
  token: string;
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "crendencials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // axios puro: os interceptors do `api` (signOut no 401, troca de senha
          // no 403) são para o navegador e não fazem sentido no login
          const response = await axios.post<SessionResponse>(
            "/session",
            { email: credentials?.email, password: credentials?.password },
            { baseURL: process.env.NEXT_PUBLIC_API },
          );

          return response.data ?? null;
        } catch (error) {
          // A mensagem vira `result.error` no signIn (ex.: "Usuário desativado...")
          const message = isAxiosError(error)
            ? error.response?.data?.message
            : undefined;
          throw new Error(message ?? "Erro ao entrar. Tente novamente.");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 12,
  },

  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        const apiUser = user as unknown as SessionResponse;

        return {
          ...token,
          token: apiUser.token,
          role: apiUser.role,
          mustChangePassword: apiUser.mustChangePassword,
        };
      }

      // update() do useSession: aceita só o que o próprio usuário pode mudar.
      // O perfil nunca vem do cliente.
      if (trigger === "update" && session) {
        return {
          ...token,
          ...(typeof session.name === "string" && { name: session.name }),
          ...(typeof session.mustChangePassword === "boolean" && {
            mustChangePassword: session.mustChangePassword,
          }),
        };
      }

      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.sub as string;
      session.user.token = token.token as string;
      session.user.role = token.role as UserRole;
      session.user.mustChangePassword = token.mustChangePassword as boolean;
      return session;
    },
  },
};
// Handler do NextAuth
const handler = NextAuth(authOptions);

// Exporta o handler como GET e POST
export { handler as GET, handler as POST };

// Exporta as opções de autenticação separadamente (caso necessário em outro lugar)
export { authOptions };
