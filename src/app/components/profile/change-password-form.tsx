"use client";

import { PasswordInput } from "@/app/components/password-input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { cn } from "@/lib/utils";
import { api } from "@/services/api/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

// Mesma regra da API (passwordSchema em apiwerk/src/schemas/user.ts)
const passwordRules = [
  {
    label: "8 ou mais caracteres",
    test: (value: string) => value.length >= 8,
  },
  {
    label: "Uma letra",
    test: (value: string) => /[A-Za-z]/.test(value),
  },
  { label: "Um número", test: (value: string) => /\d/.test(value) },
];

const schema = z
  .object({
    currentPassword: z.string().min(1, "Informe a senha atual"),
    newPassword: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .max(72, "A senha deve ter no máximo 72 caracteres")
      .regex(/[A-Za-z]/, "A senha deve conter pelo menos uma letra")
      .regex(/\d/, "A senha deve conter pelo menos um número"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "A nova senha deve ser diferente da atual",
    path: ["newPassword"],
  });

type FormData = z.infer<typeof schema>;

interface ChangePasswordFormProps {
  currentPasswordLabel?: string;
  onSuccess: () => Promise<void> | void;
}

export function ChangePasswordForm({
  currentPasswordLabel = "Senha atual",
  onSuccess,
}: ChangePasswordFormProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const newPassword = watch("newPassword") ?? "";

  const onSubmit = async ({ currentPassword, newPassword }: FormData) => {
    setLoading(true);
    try {
      await api.put("/me/password", { currentPassword, newPassword });
      reset();
      toast.success("Senha alterada com sucesso.");
      await onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message ?? "Erro ao alterar a senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-2">
        <Label htmlFor="currentPassword">{currentPasswordLabel}</Label>
        <PasswordInput
          className="h-12"
          id="currentPassword"
          autoComplete="current-password"
          invalid={!!errors.currentPassword}
          {...register("currentPassword")}
        />
        {errors.currentPassword && (
          <p className="text-xs text-red-500">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="newPassword">Nova senha</Label>
        <PasswordInput
          className="h-12"
          id="newPassword"
          autoComplete="new-password"
          invalid={!!errors.newPassword}
          {...register("newPassword")}
        />
        <ul className="flex flex-wrap gap-2" aria-label="Requisitos da senha">
          {passwordRules.map((rule) => {
            const ok = rule.test(newPassword);
            return (
              <li
                key={rule.label}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  ok
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-border bg-background text-muted-foreground",
                )}
              >
                {ok ? (
                  <Check className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <X className="h-3.5 w-3.5" aria-hidden />
                )}
                {rule.label}
                <span className="sr-only">
                  {ok ? " (atendido)" : " (pendente)"}
                </span>
              </li>
            );
          })}
        </ul>
        {errors.newPassword && (
          <p className="text-xs text-red-500">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirme a nova senha</Label>
        <PasswordInput
          className="h-12"
          id="confirmPassword"
          autoComplete="new-password"
          invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className="h-12 w-full" disabled={loading}>
        {loading ? "Salvando..." : "Salvar nova senha"}
      </Button>
    </form>
  );
}
