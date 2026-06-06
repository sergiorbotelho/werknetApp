import { SidebarNav } from "@/components/sidebar-nav";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { ThemeProvider } from "../../providers/theme-provider";

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
        <div className="flex flex-col md:mt-0 mt-10 flex-1">{children}</div>
      </div>
    </ThemeProvider>
  );
}
