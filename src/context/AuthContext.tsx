"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useEffect, useState } from "react";
import { deleteCookie } from "cookies-next";
interface AuthProviderProps {
  children: ReactNode;
}
interface AuthContextData {
  user: UserProps;
  isAuthenticated: boolean;
}
interface UserProps {
  id: string;
  name: string;
  email: string;
  token: string;
}
export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>();
  const isAuthenticated = !!user;
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id as string,
        name: session.user.name as string,
        email: session.user.email as string,
        token: session.user.token as string,
      });
    }

    if (status === "unauthenticated") {
      console.log("Nao autenticado");

      setUser(null);
      deleteCookie("next-auth.session-token");
      deleteCookie("next-auth.csrf-token");
      deleteCookie("next-auth.callback-url");
      router.replace("/login");
    }
  }, [status, session]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
