"use client";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Copy } from "lucide-react";
import { toast } from "@/lib/toast";

interface TemporaryPasswordDialogProps {
  name: string;
  password: string;
  onClose: VoidFunction;
}

export function TemporaryPasswordDialog({
  name,
  password,
  onClose,
}: TemporaryPasswordDialogProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      toast.success("Senha copiada.");
    } catch {
      toast.error("Não foi possível copiar. Selecione a senha e copie.");
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent
        className="w-[95%] sm:max-w-md"
        // Fecha só pelo botão: clicar fora ou apertar Esc perderia a senha, que não é exibida de novo
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Senha temporária</DialogTitle>
          <DialogDescription>Senha de acesso de {name}.</DialogDescription>
        </DialogHeader>
        <code className="block rounded-md border bg-muted px-4 py-3 text-center font-mono text-xl tracking-widest select-all">
          {password}
        </code>
        <p className="text-sm text-muted-foreground">
          Esta senha não será exibida novamente. Repasse ao usuário; ele deverá
          criar uma nova no primeiro acesso.
        </p>
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copiar
          </Button>
          <Button type="button" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
