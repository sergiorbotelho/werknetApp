"use server";

import { authOptions } from "@/lib/authOptions";
import axios from "axios";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function getServerApi() {
  const session = await getServerSession(authOptions);
  const authorization = session?.user?.token
    ? `Bearer ${session.user.token}`
    : "";

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    headers: {
      Authorization: authorization,
    },
  });

  instance.interceptors.response.use(undefined, async (error) => {
    // Senha redefinida pelo admin com a sessão aberta: a página renderizada no
    // servidor manda para a troca, em vez de cair numa página de erro
    if (error.response?.status === 403 && authorization) {
      const me = await axios
        .get("me", {
          baseURL: process.env.NEXT_PUBLIC_API,
          headers: { Authorization: authorization },
        })
        .then((response) => response.data)
        .catch(() => null);

      if (me?.mustChangePassword) {
        redirect("/alterar-senha");
      }
    }

    return Promise.reject(error);
  });

  return instance;
}
