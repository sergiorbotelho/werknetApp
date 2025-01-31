"use client";

import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, LogOut, User, Wrench } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarNav({
  className,

  ...props
}: SidebarNavProps) {
  const { theme, setTheme } = useTheme();

  const [isExpanded, setIsExpanded] = useState(false);
  const path = usePathname();

  const router = useRouter();
  return (
    <div
      className={cn(
        "flex h-screen flex-col items-start gap-4 border-r bg-background p-2 text-foreground transition-all  duration-300",
        isExpanded ? "w-[200px]" : "w-[60px]",
        className
      )}
      {...props}
    >
      <div className="flex w-full items-center justify-end">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-6 w-6 text-muted-foreground hover:text-foreground transition-transform",
            isExpanded && "rotate-180"
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col   items-start gap-4 w-full",
          isExpanded ? "ml-4" : " ml-2"
        )}
      >
        <NavButton
          isActive={path === "/customers"}
          icon={User}
          label="Clientes"
          isExpanded={isExpanded}
          onClick={() => router.push("/customers")}
        />
        <NavButton
          isActive={path === "/serviceorder"}
          icon={Wrench}
          label="Ordem de serviço"
          isExpanded={isExpanded}
          onClick={() => router.push("/serviceorder")}
        />
      </div>

      <div
        className={cn(
          "flex flex-col items-start ml-4 gap-4 pb-4 w-full",
          isExpanded ? "ml-4" : " ml-2"
        )}
      >
        {/* <NavButton
          icon={Settings}
          label="Configurações"
          isExpanded={isExpanded}
          onClick={() => {}}
        /> */}
        <Button
          variant="ghost"
          className={cn(
            "flex h-10 items-center gap-4 px-2 text-muted-foreground hover:text-foreground",
            !isExpanded && "justify-center "
          )}
          onClick={() => signOut()}
        >
          <LogOut />
          {isExpanded && <span>Sair</span>}
        </Button>
        {/* <NavButton
          isActive={isActive}
          icon={LogOut}
          label="Sair"
          isExpanded={isExpanded}
          onClick={() => signOut()}
        /> */}
      </div>
    </div>
  );
}

function NavButton({
  icon: Icon,
  label,
  isExpanded,
  isActive,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  isExpanded: boolean;
  isActive: boolean;
  onClick: VoidFunction;
}) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={cn(
        "flex h-10 gap-4 px-2 text-muted-foreground ",
        !isExpanded && "justify-center",
        isActive && "bg-primary text-white hover:bg-primary hover:text-white"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {isExpanded && <span>{label}</span>}
    </Button>
  );
}
