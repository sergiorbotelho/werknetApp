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
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1 min-w-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground break-words">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Button
        size="lg"
        className="w-full sm:w-auto shadow-elegant justify-center transition-transform active:scale-95"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="h-4 w-4 mr-2 shrink-0" />
        {titleButton}
      </Button>
    </header>
  );
}
