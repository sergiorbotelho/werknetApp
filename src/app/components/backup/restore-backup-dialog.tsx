"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { apiErrorMessage } from "@/helpers/apiErrorMessage";
import { downloadBackup } from "@/helpers/downloadBackup";
import { formatDateTime } from "@/helpers/format";
import { api } from "@/services/api/api";
import { BackupCounts, BackupPreview } from "@/types/backup";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";

const CONFIRMATION_WORD = "RESTAURAR";

function plural(count: number, singular: string, pluralForm: string) {
  return `${count.toLocaleString("pt-BR")} ${count === 1 ? singular : pluralForm}`;
}

// "4 usuários, 1.204 clientes, 3.877 ordens de serviço"
function describeCounts(counts: BackupCounts) {
  return [
    plural(counts.users, "usuário", "usuários"),
    plural(counts.clients, "cliente", "clientes"),
    plural(counts.os, "ordem de serviço", "ordens de serviço"),
  ].join(", ");
}

interface RestoreBackupDialogProps {
  file: File;
  preview: BackupPreview;
  onClose: () => void;
}

type Step = "idle" | "saving" | "restoring";

export function RestoreBackupDialog({
  file,
  preview,
  onClose,
}: RestoreBackupDialogProps) {
  const [confirmation, setConfirmation] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const busy = step !== "idle";

  const handleRestore = async () => {
    // Backup do estado atual antes de apagar tudo: é o "desfazer" do restore
    setStep("saving");
    try {
      await downloadBackup("-antes-da-restauracao");
    } catch (error) {
      toast.error(await apiErrorMessage(error, "Erro ao gerar o backup."));
      setStep("idle");
      return;
    }

    setStep("restoring");
    try {
      // Tipo fixo: o Windows pode rotular .gz como application/x-gzip ou sem tipo
      await api.post("/backup/restore", file, {
        headers: { "Content-Type": "application/gzip" },
      });
      toast.success("Restauração concluída. Entre novamente.");
      // Usuários e senhas mudaram: a sessão atual pode nem existir mais.
      // O dialog continua travado até o redirecionamento.
      setTimeout(() => signOut({ callbackUrl: "/login" }), 1500);
    } catch (error) {
      toast.error(await apiErrorMessage(error, "Erro ao restaurar o backup."));
      setStep("idle");
    }
  };

  return (
    <AlertDialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restaurar backup</AlertDialogTitle>
          <AlertDialogDescription>
            Backup de {formatDateTime(preview.createdAt)}, feito por{" "}
            {preview.createdBy}.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 text-sm">
          <p>{describeCounts(preview.counts)}</p>
          <p className="font-medium text-destructive">
            Todos os dados atuais serão substituídos pelos do arquivo. As senhas
            dos usuários voltam às da data do backup. Antes de restaurar, um
            backup do estado atual será baixado automaticamente.
          </p>
          <div className="space-y-2">
            <Label htmlFor="restore-confirmation">
              Digite {CONFIRMATION_WORD} para confirmar
            </Label>
            <Input
              id="restore-confirmation"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              disabled={busy}
              autoComplete="off"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Cancelar</AlertDialogCancel>
          {/* Button comum: o AlertDialogAction fecharia o dialog no clique */}
          <Button
            variant="destructive"
            onClick={handleRestore}
            disabled={busy || confirmation !== CONFIRMATION_WORD}
          >
            {step === "saving"
              ? "Salvando backup atual..."
              : step === "restoring"
                ? "Restaurando..."
                : "Restaurar"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
