"use client";

import { cn } from "@/lib/utils";
import { api } from "@/services/api/api";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "@/lib/toast";
import { ConfirmationDialog } from "../confirmation-modal";
import { Header } from "../header";
import { SearchInput } from "../search-input";
import { TemporaryPasswordDialog } from "./temporary-password-dialog";
import { UserList } from "./user-list";
import { UserModal } from "./user-modal";

interface UsersProps {
  users: User[];
  currentUserId: string;
}

type StatusFilter = "all" | "active" | "inactive";

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Ativos" },
  { value: "inactive", label: "Inativos" },
];

function summary(users: User[]) {
  const inactive = users.filter((user) => !user.active).length;
  const total = `${users.length} ${users.length === 1 ? "usuário" : "usuários"}`;
  if (inactive === 0) return total;
  return `${total}, ${inactive} ${inactive === 1 ? "inativo" : "inativos"}`;
}

export default function Users({ users, currentUserId }: UsersProps) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return users.filter((user) => {
      if (statusFilter === "active" && !user.active) return false;
      if (statusFilter === "inactive" && user.active) return false;
      if (!term) return true;
      return (
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    });
  }, [users, q, statusFilter]);

  const emptyMessage = q.trim()
    ? `Nenhum usuário encontrado para "${q.trim()}".`
    : statusFilter === "inactive"
      ? "Nenhum usuário inativo."
      : "Nenhum usuário cadastrado. Use \"Novo usuário\" para cadastrar o primeiro.";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToReset, setUserToReset] = useState<User | null>(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState<{
    name: string;
    password: string;
  } | null>(null);

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleResetPassword = async () => {
    if (!userToReset) return;
    setResetLoading(true);
    try {
      const { data } = await api.post(
        `/users/${userToReset.id}/reset-password`,
      );
      setTemporaryPassword({
        name: userToReset.name,
        password: data.temporaryPassword,
      });
      setUserToReset(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message ?? "Erro ao redefinir a senha.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-4 w-full max-w-6xl space-y-6 px-4 py-4 sm:px-6 md:mt-0 md:px-8 lg:px-10 lg:py-8">
      <Header
        title="Usuários"
        description={summary(users)}
        titleButton="Novo usuário"
        setIsModalOpen={setIsModalOpen}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={q}
          onChange={setQ}
          placeholder="Buscar por nome ou e-mail"
        />
        <div
          role="group"
          aria-label="Filtrar por situação"
          className="inline-flex rounded-lg border border-border bg-card p-1"
        >
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={statusFilter === filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={cn(
                "h-9 flex-1 rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-none",
                statusFilter === filter.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <UserList
        users={filtered}
        currentUserId={currentUserId}
        emptyMessage={emptyMessage}
        onEdit={setSelectedUser}
        onResetPassword={setUserToReset}
      />
      {(isModalOpen || selectedUser !== null) && (
        <UserModal
          user={selectedUser}
          isSelf={selectedUser?.id === currentUserId}
          onClose={handleCloseModal}
          onCreated={(name, password) =>
            setTemporaryPassword({ name, password })
          }
        />
      )}
      <ConfirmationDialog
        title="Redefinir senha?"
        description={`Uma nova senha temporária será gerada para ${
          userToReset?.name ?? ""
        }. A senha atual deixa de funcionar.`}
        loading={resetLoading}
        loadingText="Gerando..."
        openAlertDialog={userToReset !== null}
        setOpenAlertDialog={(open) => {
          if (!open) setUserToReset(null);
        }}
        handleExcluir={handleResetPassword}
      />
      {temporaryPassword && (
        <TemporaryPasswordDialog
          name={temporaryPassword.name}
          password={temporaryPassword.password}
          onClose={() => setTemporaryPassword(null)}
        />
      )}
    </div>
  );
}
