"use client";

import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, LogOut, Menu, Users2Icon, X } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}
const nav = [
  { to: "/", label: "Ordens de Serviço", icon: LayoutDashboard },
  { to: "/customers", label: "Clientes", icon: Users2Icon },
];
export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const path = usePathname();
  const route = useRouter();
  return (
    <div className="min-h-screen flex ">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-40 w-72 bg-white text-primary-foreground flex flex-col transition-transform md:translate-x-0",
          isExpanded ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-2 bg-white flex items-center gap-3 border-b border-primary-foreground/10">
          <div
            className=" w-full rounded-xl bg-accent/30 flex items-center justify-center cursor-pointer"
            onClick={() => route.push("/")}
          >
            <Image src="/logo.jpeg" alt="Logo" width={100} height={200} />
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map((item, idx) => {
            const active =
              item.to === "/"
                ? path === "/"
                : path.startsWith(item.to) && item.to !== "/";
            return (
              <Link
                key={idx}
                href={item.to}
                onClick={() => setIsExpanded(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  active
                    ? "bg-primary text-white shadow-elegant"
                    : "hover:bg-gray-300 text-black",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-primary-foreground/10">
          <Button
            variant="ghost"
            className="w-full justify-start text-black hover:bg-gray-300 "
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {isExpanded && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 ">
        <header className="md:hidden h-14 flex items-center px-4 border-b bg-card w-full absolute">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:bg-primary hover:text-white"
          >
            {isExpanded ? <X /> : <Menu />}
          </Button>
          <span className="ml-2 font-semibold">WerkNet</span>
        </header>
      </div>
    </div>
  );
}
