import { Button } from "@/app/components/ui/button";
import { Plus } from "lucide-react";

interface HeaderProps {
  title: string;
  description: string;
  titleButton: string;
  setIsModalOpen: (open: boolean) => void;
}

export function Header({
  title,
  description,
  titleButton,
  setIsModalOpen,
}: HeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 space-y-1">
        <h1 className="break-words text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Button
        className="h-11 w-full sm:w-auto"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4 shrink-0" />
        {titleButton}
      </Button>
    </header>
  );
}
