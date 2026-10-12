"use client";

import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { api } from "@/services/api/api";
import { roleLabels, UserRole } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { ChangePasswordForm } from "./change-password-form";

const schema = z.object({
  name: z.string().trim().min(2, "Nome deve ter no mínimo 2 caracteres"),
});

type FormData = z.infer<typeof schema>;

interface ProfileProps {
  me: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export function Profile({ me }: ProfileProps) {
  const { update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: me.name },
  });

  const onSubmit = async ({ name }: FormData) => {
    setLoading(true);
    try {
      const { data } = await api.put("/me", { name });
      await update({ name: data.name });
      router.refresh();
      toast.success("Nome alterado com sucesso.");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message ?? "Erro ao salvar o nome.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 py-4 sm:px-6 md:px-8 lg:px-10 space-y-4 md:space-y-8 max-w-3xl mx-auto mt-4 md:mt-0">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Meu perfil
        </h1>
        <p className="text-sm text-muted-foreground">
          Altere seu nome e sua senha.
        </p>
      </header>

      <Card className="p-4 sm:p-6 space-y-4 bg-card-gradient">
        <h2 className="text-lg font-semibold">Dados</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-1">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-1">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" value={me.email} disabled />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="role">Perfil</Label>
            <Input id="role" value={roleLabels[me.role]} disabled />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-4 sm:p-6 space-y-4 bg-card-gradient">
        <h2 className="text-lg font-semibold">Trocar senha</h2>
        <ChangePasswordForm onSuccess={() => undefined} />
      </Card>
    </div>
  );
}
