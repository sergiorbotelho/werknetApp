"use client";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
interface NextAuthSessionProps {
  children: ReactNode;
}
export default function NextAuthSessionProvider({
  children,
}: NextAuthSessionProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
