"use client";

import { initials } from "@/helpers/initials";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

interface UserAvatarProps {
  id: string;
  name: string;
  avatarUpdatedAt: string | null;
  // "" quando o nome já aparece ao lado (o leitor de tela não repete)
  alt?: string;
  // Tamanho, anel, sombra e tipografia das iniciais
  className?: string;
  // Fundo e cor do texto das iniciais (só sem foto)
  fallbackClassName?: string;
}

// Foto do usuário ou, sem foto, as iniciais.
// unoptimized: o navegador busca /api/avatar direto, com o cookie da sessão.
// Pelo otimizador do Next, a busca sairia do servidor, sem o cookie (401).
export function UserAvatar({
  id,
  name,
  avatarUpdatedAt,
  alt,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  const [failed, setFailed] = useState(false);

  // Foto nova: tenta carregar de novo
  useEffect(() => {
    setFailed(false);
  }, [avatarUpdatedAt]);

  const showPhoto = Boolean(avatarUpdatedAt) && !failed;

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        className,
        showPhoto ? "bg-muted" : fallbackClassName,
      )}
    >
      {showPhoto ? (
        <Image
          unoptimized
          fill
          src={`/api/avatar/${id}?v=${encodeURIComponent(avatarUpdatedAt)}`}
          alt={alt ?? `Foto de ${name}`}
          sizes="128px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden>{initials(name)}</span>
      )}
    </div>
  );
}
