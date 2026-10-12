import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ReactNode } from "react";

// Classes do <Input> do shadcn, para campos que não usam o componente
// (máscaras e áreas de texto)
export const fieldClassName =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

interface FormModalProps {
  title: string;
  description?: string;
  headerAction?: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  size?: "md" | "lg";
  onClose: VoidFunction;
}

// Modal de formulário: cabeçalho e rodapé fixos, corpo rolável.
// No celular ocupa a tela inteira.
export function FormModal({
  title,
  description,
  headerAction,
  footer,
  children,
  size = "md",
  onClose,
}: FormModalProps) {
  return (
    <DialogContent
      className={cn(
        // Altura definida também no desktop: o ScrollArea precisa dela para rolar
        "flex h-[100dvh] max-w-none flex-col gap-0 overflow-hidden rounded-none p-0 sm:h-[min(88vh,860px)] sm:rounded-xl",
        size === "lg" ? "sm:max-w-3xl" : "sm:max-w-2xl",
      )}
    >
      <header className="flex items-start gap-3 border-b border-border px-5 py-4 sm:px-6">
        <div className="min-w-0 flex-1">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription className="mt-0.5 truncate text-sm text-muted-foreground">
              {description}
            </DialogDescription>
          ) : (
            <DialogDescription className="sr-only">{title}</DialogDescription>
          )}
        </div>
        {headerAction}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="-mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {/* type="auto": a barra aparece sempre que há mais campos abaixo */}
      <ScrollArea type="auto" className="min-h-0 flex-1">
        <div className="px-5 py-5 sm:px-6">{children}</div>
      </ScrollArea>

      <footer className="border-t border-border bg-card px-5 py-3 sm:px-6">
        {footer}
      </footer>
    </DialogContent>
  );
}

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

// Grupo de campos com título; as seções se separam por uma linha.
// Use dentro de um contêiner com "space-y-5".
export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="border-t border-border pt-5 first:border-t-0 first:pt-0">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      )}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-6">
        {children}
      </div>
    </section>
  );
}

interface FormModalActionsProps {
  danger?: ReactNode;
  children: ReactNode;
}

// Rodapé: ação destrutiva à esquerda; cancelar e salvar à direita.
// No celular os botões ficam empilhados, com salvar no topo.
export function FormModalActions({ danger, children }: FormModalActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
      {danger && <div className="sm:mr-auto">{danger}</div>}
      <div className="flex flex-col-reverse gap-2 sm:ml-auto sm:flex-row">
        {children}
      </div>
    </div>
  );
}
