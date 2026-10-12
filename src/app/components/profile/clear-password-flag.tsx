"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// A senha já foi trocada (ex.: em outro navegador), mas a sessão ainda pede a troca:
// limpa a flag antes de ir para "/", senão o layout devolveria para cá em laço
export function ClearPasswordFlag() {
  const { update } = useSession();
  const router = useRouter();

  useEffect(() => {
    update({ mustChangePassword: false }).then(() => {
      router.replace("/");
      router.refresh();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
