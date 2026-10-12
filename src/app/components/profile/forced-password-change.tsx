"use client";

import { Button } from "@/app/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangePasswordForm } from "./change-password-form";

export function ForcedPasswordChange() {
  const { update } = useSession();
  const router = useRouter();

  const handleSuccess = async () => {
    await update({ mustChangePassword: false });
    router.replace("/");
    router.refresh();
  };

  return (
    <div className="space-y-2">
      <ChangePasswordForm
        currentPasswordLabel="Senha temporária"
        onSuccess={handleSuccess}
      />
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        Sair
      </Button>
    </div>
  );
}
