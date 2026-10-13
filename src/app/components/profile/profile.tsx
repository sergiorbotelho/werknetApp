"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { UserAvatar } from "@/app/components/user-avatar";
import { api } from "@/services/api/api";
import { roleLabels, UserRole } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ShieldCheck, UserRound } from "lucide-react";
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
    avatarUpdatedAt: string | null;
  };
}

export function Profile({ me }: ProfileProps) {
  const { update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState(me.name);
  const [avatarUpdatedAt, setAvatarUpdatedAt] = useState(me.avatarUpdatedAt);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: me.name },
  });

  const onSubmit = async ({ name }: FormData) => {
    setLoading(true);
    try {
      const { data } = await api.put("/me", { name });
      await update({ name: data.name });
      setDisplayName(data.name);
      reset({ name: data.name });
      router.refresh();
      toast.success("Nome alterado com sucesso.");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message ?? "Erro ao salvar o nome.");
    } finally {
      setLoading(false);
    }
  };

  const RoleIcon = me.role === "ADMIN" ? ShieldCheck : UserRound;

  return (
    <div className="w-full pb-12">
      {/* Capa */}
      <div className="h-32 bg-hero sm:h-44" aria-hidden />

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-8">
        {/* Identidade: o avatar sobrepõe a borda da capa */}
        <header className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
          <UserAvatar
            id={me.id}
            name={displayName}
            avatarUpdatedAt={avatarUpdatedAt}
            className="h-24 w-24 text-3xl font-black tracking-tight shadow-glow ring-[6px] ring-background sm:h-32 sm:w-32 sm:text-4xl"
            fallbackClassName="bg-accent text-accent-foreground"
          />
          <div className="min-w-0 space-y-2 sm:pb-2">
            <h1 className="break-words text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              {displayName}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <Mail className="h-4 w-4 shrink-0" aria-hidden />
                <span className="truncate">{me.email}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                <RoleIcon className="h-3.5 w-3.5" aria-hidden />
                {roleLabels[me.role]}
              </span>
            </div>
          </div>
        </header>

        <div className="mt-10 grid gap-10 border-t border-border pt-10 lg:grid-cols-2 lg:gap-0">
          <section aria-labelledby="dados-titulo" className="lg:pr-10">
            <h2
              id="dados-titulo"
              className="text-lg font-semibold text-foreground"
            >
              Seus dados
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              É o nome que aparece para a equipe no sistema.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  autoComplete="name"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                  className={
                    errors.name
                      ? "h-12 border-red-500 focus-visible:ring-red-500"
                      : "h-12"
                  }
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>
              <Button
                type="submit"
                className="h-12 w-full"
                disabled={loading || !isDirty}
              >
                {loading ? "Salvando..." : "Salvar nome"}
              </Button>
            </form>
          </section>

          <section
            aria-labelledby="senha-titulo"
            className="border-t border-border pt-10 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
          >
            <h2
              id="senha-titulo"
              className="text-lg font-semibold text-foreground"
            >
              Senha
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Use pelo menos 8 caracteres, com letras e números.
            </p>
            <div className="mt-6">
              <ChangePasswordForm onSuccess={() => undefined} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
