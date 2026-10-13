"use client";

import { ConfirmationDialog } from "@/app/components/confirmation-modal";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { UserAvatar } from "@/app/components/user-avatar";
import { cropToAvatar } from "@/helpers/cropImage";
import { api } from "@/services/api/api";
import { roleLabels, UserRole } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";
import type { Area } from "react-easy-crop";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { AvatarCropDialog } from "./avatar-crop-dialog";
import { ChangePasswordForm } from "./change-password-form";

const schema = z.object({
  name: z.string().trim().min(2, "Nome deve ter no mínimo 2 caracteres"),
});

type FormData = z.infer<typeof schema>;

const MAX_PHOTO_SIZE = 10 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [confirmRemovePhoto, setConfirmRemovePhoto] = useState(false);
  const [removingPhoto, setRemovingPhoto] = useState(false);
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

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Zera o input: escolher o mesmo arquivo de novo dispara onChange
    event.target.value = "";
    if (!file) return;

    if (
      !ACCEPTED_PHOTO_TYPES.includes(file.type) ||
      file.size > MAX_PHOTO_SIZE
    ) {
      toast.error("Escolha uma imagem JPEG, PNG ou WebP de até 10 MB.");
      return;
    }

    setCropSrc(URL.createObjectURL(file));
  };

  const closeCrop = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  };

  const handlePhotoError = () => {
    closeCrop();
    toast.error("Não foi possível abrir a imagem. Escolha outro arquivo.");
  };

  const handleSavePhoto = async (area: Area) => {
    if (!cropSrc) return;
    setSavingPhoto(true);
    try {
      const blob = await cropToAvatar(cropSrc, area);
      const { data } = await api.put("/me/avatar", blob, {
        headers: { "Content-Type": "image/jpeg" },
      });
      setAvatarUpdatedAt(data.avatarUpdatedAt);
      closeCrop();
      router.refresh();
      toast.success("Foto atualizada.");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message ?? "Erro ao salvar a foto.");
    } finally {
      setSavingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    setRemovingPhoto(true);
    try {
      await api.delete("/me/avatar");
      setAvatarUpdatedAt(null);
      setConfirmRemovePhoto(false);
      router.refresh();
      toast.success("Foto removida.");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message ?? "Erro ao remover a foto.");
    } finally {
      setRemovingPhoto(false);
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
          <div className="relative w-fit shrink-0">
            <UserAvatar
              id={me.id}
              name={displayName}
              avatarUpdatedAt={avatarUpdatedAt}
              className="h-24 w-24 text-3xl font-black tracking-tight shadow-glow ring-[6px] ring-background sm:h-32 sm:w-32 sm:text-4xl"
              fallbackClassName="bg-accent text-accent-foreground"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Alterar foto"
              title="Alterar foto"
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-4 ring-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-ring sm:h-10 sm:w-10"
            >
              <Camera className="h-4 w-4" aria-hidden />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
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
              {avatarUpdatedAt && (
                <button
                  type="button"
                  onClick={() => setConfirmRemovePhoto(true)}
                  className="font-medium underline-offset-4 hover:text-destructive hover:underline"
                >
                  Remover foto
                </button>
              )}
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

      <AvatarCropDialog
        key={cropSrc ?? "closed"}
        imageSrc={cropSrc}
        saving={savingPhoto}
        onCancel={closeCrop}
        onSave={handleSavePhoto}
        onImageError={handlePhotoError}
      />
      <ConfirmationDialog
        title="Remover foto de perfil?"
        description="Seu avatar volta a mostrar as iniciais do seu nome."
        loading={removingPhoto}
        loadingText="Removendo..."
        openAlertDialog={confirmRemovePhoto}
        setOpenAlertDialog={setConfirmRemovePhoto}
        handleExcluir={handleRemovePhoto}
      />
    </div>
  );
}
