import { isAxiosError } from "axios";

// Com responseType "blob", o corpo de erro da API chega como Blob, não como objeto
export async function apiErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError(error)) return fallback;

  const data = error.response?.data;

  try {
    const body = data instanceof Blob ? JSON.parse(await data.text()) : data;
    return typeof body?.message === "string" ? body.message : fallback;
  } catch {
    return fallback;
  }
}
