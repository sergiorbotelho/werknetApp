import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { nextAuthOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Header } from "../components/header";

export default async function PrivateLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(nextAuthOptions);

  if (!session) {
    redirect("/login");
  }
  return (
    <>
      <Header />
      {children}
    </>
  );
}
