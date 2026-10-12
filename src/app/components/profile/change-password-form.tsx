"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
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
    label: "Mínimo de 8 caracteres",
    test: (value: string) => value.length >= 8,
  },
  {
    label: "Pelo menos uma letra",
    test: (value: string) => /[A-Za-z]/.test(value),
  },
  { label: "Pelo menos um número", test: (value: string) => /\d/.test(value) },
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-1">
        <Label htmlFor="currentPassword">{currentPasswordLabel}</Label>
        <Input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          {...register("currentPassword")}
          className={errors.currentPassword ? "border-red-500" : ""}
        />
        {errors.currentPassword && (
          <p className="text-xs text-red-500">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div className="grid gap-1">
        <Label htmlFor="newPassword">Nova senha</Label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          {...register("newPassword")}
          className={errors.newPassword ? "border-red-500" : ""}
        />
        {errors.newPassword && (
          <p className="text-xs text-red-500">{errors.newPassword.message}</p>
        )}
      </div>

      <ul className="space-y-1 text-sm">
        {passwordRules.map((rule) => {
          const ok = rule.test(newPassword);
          return (
            <li
              key={rule.label}
              className={cn(
                "flex items-center gap-2",
                ok ? "text-green-600" : "text-muted-foreground",
              )}
            >
              {ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              {rule.label}
            </li>
          );
        })}
      </ul>

      <div className="grid gap-1">
        <Label htmlFor="confirmPassword">Confirme a nova senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          className={errors.confirmPassword ? "border-red-500" : ""}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Salvando..." : "Salvar nova senha"}
      </Button>
    </form>
  );
}
