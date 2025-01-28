import { SidebarNav } from "@/components/sidebar-nav";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Header } from "../components/header";
import { ThemeProvider } from "../components/theme-provider";

export default async function PrivateLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  return (
    <ThemeProvider>
      {/* <SheetMenu /> */}
      <div className="flex">
        <SidebarNav />
        <div className="flex flex-col flex-1">
          <Header />
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}
