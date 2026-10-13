"use client";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { apiErrorMessage } from "@/helpers/apiErrorMessage";
import { downloadBackup } from "@/helpers/downloadBackup";
import { formatDateTime } from "@/helpers/format";
import { BACKUP_WARNING_BYTES } from "@/helpers/readBackup";
import { cn } from "@/lib/utils";
import { BackupLogEntry, BackupStatus } from "@/types/backup";
import { DatabaseBackup, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const STALE_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

function daysAgo(value: string) {
  const days = Math.floor((Date.now() - new Date(value).getTime()) / DAY_MS);
  if (days <= 0) return "hoje";
  if (days === 1) return "ontem";
  return `há ${days} dias`;
}

// "há 12 dias, por Sergio (01/10/2026 14:30)"
export function describeLog(entry: BackupLogEntry) {
  return `${daysAgo(entry.created_at)}, por ${entry.userName} (${formatDateTime(entry.created_at)})`;
}

interface BackupProps {
  status: BackupStatus;
}

export default function Backup({ status }: BackupProps) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);

  const { lastBackup } = status;
  const stale =
    !lastBackup ||
    Date.now() - new Date(lastBackup.created_at).getTime() >
      STALE_DAYS * DAY_MS;

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const size = await downloadBackup();
      toast.success("Backup gerado.");
      if (size > BACKUP_WARNING_BYTES) {
        toast.warning(
          "O backup está perto do limite de 4 MB para restauração pela tela.",
          { autoClose: 8000 },
        );
      }
      router.refresh();
    } catch (error) {
      toast.error(await apiErrorMessage(error, "Erro ao gerar o backup."));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="mx-auto mt-4 w-full max-w-6xl space-y-6 px-4 py-4 sm:px-6 md:mt-0 md:px-8 lg:px-10 lg:py-8">
      <header className="min-w-0 space-y-1">
        <h1 className="break-words text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          Backup
        </h1>
        <p className="text-sm text-muted-foreground">
          Gere uma cópia de todos os dados ou restaure a partir de um arquivo.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <DatabaseBackup className="h-5 w-5" />
              Backup
            </CardTitle>
            <CardDescription>
              Baixa um arquivo com todos os dados: usuários, fotos, clientes e
              ordens de serviço.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-3 text-sm">
            <p
              className={cn(
                "flex items-start gap-2",
                stale && "font-medium text-destructive",
              )}
            >
              {stale && <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />}
              {lastBackup
                ? `Último backup: ${describeLog(lastBackup)}`
                : "Nenhum backup feito ainda"}
            </p>
            <p className="text-muted-foreground">
              Guarde o arquivo em local seguro: ele contém dados de clientes e
              senhas criptografadas.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="h-11 w-full sm:w-auto"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? "Gerando..." : "Gerar backup"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
