import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function PrivateLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }
  return <>{children}</>;
}
