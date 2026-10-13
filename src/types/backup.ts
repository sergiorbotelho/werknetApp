export interface BackupCounts {
  users: number;
  userAvatars: number;
  clients: number;
  os: number;
}

export interface BackupLogEntry {
  userName: string;
  created_at: string;
  counts: BackupCounts;
}

export interface BackupStatus {
  lastBackup: BackupLogEntry | null;
  lastRestore: BackupLogEntry | null;
}

// Lido do arquivo no navegador, antes de enviar
export interface BackupPreview {
  createdAt: string;
  createdBy: string;
  counts: BackupCounts;
}
