import { api } from "@/services/api/api";

// Gera o backup na API e baixa o arquivo. Devolve o tamanho em bytes.
export async function downloadBackup(suffix = "") {
  const response = await api.post<Blob>("/backup", null, {
    responseType: "blob",
  });

  const disposition = response.headers["content-disposition"] as
    | string
    | undefined;
  const name =
    disposition?.match(/filename="([^"]+)"/)?.[1] ?? "werk-backup.json.gz";
  const fileName = suffix
    ? name.replace(/\.json\.gz$/, `${suffix}.json.gz`)
    : name;

  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  return response.data.size;
}
