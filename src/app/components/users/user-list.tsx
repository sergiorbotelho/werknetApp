import { Button } from "@/app/components/ui/button";
import { UserAvatar } from "@/app/components/user-avatar";
import { cn } from "@/lib/utils";
import { roleLabels, User } from "@/types/user";
import { KeyRound, Pencil, SearchX } from "lucide-react";

interface UserListProps {
  users: User[];
  currentUserId: string;
  emptyMessage: string;
  onEdit: (user: User) => void;
  onResetPassword: (user: User) => void;
}

// Fuso fixo: o mesmo texto no servidor e no navegador (evita erro de hidratação)
const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "America/Recife",
});

// Sem foto, a cor das iniciais indica o perfil; inativo fica neutro
function UserListAvatar({
  user,
  size = "md",
}: {
  user: User;
  size?: "md" | "lg";
}) {
  return (
    <UserAvatar
      id={user.id}
      name={user.name}
      avatarUpdatedAt={user.avatarUpdatedAt}
      alt=""
      className={cn(
        "font-bold tracking-tight",
        size === "lg" ? "h-12 w-12 text-base" : "h-10 w-10 text-sm",
      )}
      fallbackClassName={
        !user.active
          ? "bg-muted text-muted-foreground"
          : user.role === "ADMIN"
            ? "bg-primary text-primary-foreground"
            : "bg-accent text-accent-foreground"
      }
    />
  );
}

function UserStatus({ user }: { user: User }) {
  const status = !user.active
    ? { label: "Inativo", dot: "bg-slate-400", text: "text-muted-foreground" }
    : user.mustChangePassword
      ? {
          label: "Aguardando 1º acesso",
          dot: "bg-amber-500",
          text: "text-amber-700",
        }
      : { label: "Ativo", dot: "bg-green-500", text: "text-green-700" };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium",
        status.text,
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", status.dot)} aria-hidden />
      {status.label}
    </span>
  );
}

function RoleTag({ user }: { user: User }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
        user.role === "ADMIN"
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground",
      )}
    >
      {roleLabels[user.role]}
    </span>
  );
}

function NameAndEmail({ user, isSelf }: { user: User; isSelf: boolean }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <span className="truncate font-semibold text-foreground">
          {user.name}
        </span>
        {isSelf && (
          <span className="shrink-0 rounded-md border border-border px-1.5 text-xs font-medium text-muted-foreground">
            Você
          </span>
        )}
      </div>
      <div className="break-all text-sm text-muted-foreground">
        {user.email}
      </div>
    </div>
  );
}

export function UserList({
  users,
  currentUserId,
  emptyMessage,
  onEdit,
  onResetPassword,
}: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <SearchX className="h-8 w-8 text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      {/* Telas grandes: tabela */}
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card lg:block">
        <table className="w-full text-left">
          <thead className="border-b border-border bg-secondary text-xs font-semibold text-secondary-foreground">
            <tr>
              <th scope="col" className="px-5 py-3">
                Usuário
              </th>
              <th scope="col" className="px-5 py-3">
                Perfil
              </th>
              <th scope="col" className="px-5 py-3">
                Situação
              </th>
              <th scope="col" className="hidden px-5 py-3 xl:table-cell">
                Cadastro
              </th>
              <th scope="col" className="px-5 py-3 text-right">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              return (
                <tr
                  key={user.id}
                  className={cn(
                    "transition-colors hover:bg-muted",
                    !user.active && "text-muted-foreground",
                  )}
                >
                  <td className="px-5 py-4">
                    <div
                      className={cn(
                        "flex items-center gap-3",
                        !user.active && "opacity-60",
                      )}
                    >
                      <UserListAvatar user={user} />
                      <NameAndEmail user={user} isSelf={isSelf} />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <RoleTag user={user} />
                  </td>
                  <td className="px-5 py-4">
                    <UserStatus user={user} />
                  </td>
                  <td className="hidden whitespace-nowrap px-5 py-4 text-sm text-muted-foreground xl:table-cell">
                    {dateFormatter.format(new Date(user.created_at))}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(user)}
                        aria-label={`Editar ${user.name}`}
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {isSelf ? (
                        // Mantém os ícones alinhados entre as linhas
                        <span className="h-10 w-10" aria-hidden />
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onResetPassword(user)}
                          aria-label={`Redefinir senha de ${user.name}`}
                          title="Redefinir senha"
                        >
                          <KeyRound className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Celular e tablet: um cartão por usuário */}
      <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:hidden">
        {users.map((user) => {
          const isSelf = user.id === currentUserId;
          return (
            <li
              key={user.id}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div
                className={cn(
                  "flex items-start gap-3",
                  !user.active && "opacity-60",
                )}
              >
                <UserListAvatar user={user} size="lg" />
                <NameAndEmail user={user} isSelf={isSelf} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <RoleTag user={user} />
                <UserStatus user={user} />
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  className="h-11 flex-1"
                  onClick={() => onEdit(user)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                {!isSelf && (
                  <Button
                    variant="outline"
                    className="h-11 flex-1"
                    onClick={() => onResetPassword(user)}
                  >
                    <KeyRound className="mr-2 h-4 w-4" />
                    Redefinir senha
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
