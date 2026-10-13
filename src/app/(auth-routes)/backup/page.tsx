import Backup from "@/app/components/backup/backup";
import { authOptions } from "@/lib/authOptions";
import { getServerApi } from "@/services/api/serverApi";
import { BackupStatus } from "@/types/backup";
import { isAxiosError } from "axios";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function BackupPage() {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "ADMIN") {
    redirect("/");
  }

  const apiServer = await getServerApi();
  let data: BackupStatus | undefined;
  try {
    ({ data } = await apiServer.get<BackupStatus>("backup/status"));
  } catch (error) {
    // Admin rebaixado no meio da sessão: a sessão ainda diz ADMIN, mas a API responde 403
    if (!(isAxiosError(error) && error.response?.status === 403)) {
      throw error;
    }
  }

  if (!data) {
    redirect("/");
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <Backup status={data} />
    </div>
  );
}
