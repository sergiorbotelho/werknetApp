"use client";

import { api } from "@/services/api/api";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { ConfirmationDialog } from "../confirmation-modal";
import { Header } from "../header";
import { TemporaryPasswordDialog } from "./temporary-password-dialog";
import { UserCard } from "./user-card";
import { UserModal } from "./user-modal";

interface UsersProps {
  users: User[];
  currentUserId: string;
}

export default function Users({ users, currentUserId }: UsersProps) {
  const router = useRouter();
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
    <div className="w-full px-4 py-4 sm:px-6 md:px-8 lg:px-10 space-y-4 md:space-y-8 max-w-7xl mx-auto mt-4 md:mt-0">
      <Header
        title="Usuários"
        description="Cadastre usuários e defina o perfil de acesso."
        titleButton="Novo Usuário"
        setIsModalOpen={setIsModalOpen}
      />
      <UserCard
        users={users}
        currentUserId={currentUserId}
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
