import { BackupPreview } from "@/types/backup";

// A Vercel limita o corpo das requisições a 4,5 MB; a API aceita até 4 MB
export const BACKUP_MAX_BYTES = 4 * 1024 * 1024;
export const BACKUP_WARNING_BYTES = 3.5 * 1024 * 1024;

const INVALID_FILE =
  "Arquivo inválido: escolha um backup .json.gz gerado pelo sistema.";
const tables = ["users", "userAvatars", "clients", "os"] as const;

// Prévia local: confere o básico e conta os registros. A validação completa é da API.
export async function readBackup(file: File): Promise<BackupPreview> {
  if (file.size > BACKUP_MAX_BYTES) {
    throw new Error("Arquivo muito grande (máx. 4 MB).");
  }

  let content: any;
  try {
    const stream = file
      .stream()
      .pipeThrough(new DecompressionStream("gzip"));
    content = JSON.parse(await new Response(stream).text());
  } catch {
    throw new Error(INVALID_FILE);
  }

  if (content?.format !== "werk-backup") {
    throw new Error(INVALID_FILE);
  }
  if (content.version !== 1) {
    throw new Error("Versão de backup não suportada.");
  }
  if (!tables.every((table) => Array.isArray(content.data?.[table]))) {
    throw new Error(INVALID_FILE);
  }

  return {
    createdAt: content.createdAt,
    createdBy: content.createdBy,
    counts: {
      users: content.data.users.length,
      userAvatars: content.data.userAvatars.length,
      clients: content.data.clients.length,
      os: content.data.os.length,
    },
  };
}
