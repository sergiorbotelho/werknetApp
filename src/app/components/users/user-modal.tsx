"use client";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { api } from "@/services/api/api";
import { roleLabels, User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquareX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z
    .string()
    .trim()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido"),
  role: z.enum(["ADMIN", "BASICO"], { required_error: "Selecione o perfil" }),
  active: z.enum(["true", "false"]),
});

type FormData = z.infer<typeof schema>;

interface UserModalProps {
  user: User | null; // null = cadastro
  isSelf: boolean;
  onClose: VoidFunction;
  onCreated: (name: string, temporaryPassword: string) => void;
}

export function UserModal({ user, isSelf, onClose, onCreated }: UserModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEditing = user !== null;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: user?.role ?? "BASICO",
      active: user?.active === false ? "false" : "true",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (isEditing) {
        // O próprio admin só altera o nome: a API recusa mudar o próprio perfil ou situação
        const body = isSelf
          ? { name: data.name }
          : { name: data.name, role: data.role, active: data.active === "true" };
        await api.put(`/users/${user.id}`, body);
        toast.success("Usuário alterado com sucesso.");
        router.refresh();
        onClose();
      } else {
        const response = await api.post("/users", {
          name: data.name,
          email: data.email,
          role: data.role,
        });
        router.refresh();
        onClose();
        onCreated(response.data.user.name, response.data.temporaryPassword);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message ?? "Erro ao salvar o usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="w-[95%] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {isEditing ? "Editar usuário" : "Novo usuário"}
          </DialogTitle>
          <DialogTrigger
            asChild
            className="absolute right-2 top-1 cursor-pointer"
          >
            <SquareX size={30} />
          </DialogTrigger>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} disabled={isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perfil</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSelf}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o perfil" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BASICO">{roleLabels.BASICO}</SelectItem>
                      <SelectItem value="ADMIN">{roleLabels.ADMIN}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isEditing && (
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Situação</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSelf}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Ativo</SelectItem>
                        <SelectItem value="false">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {isSelf && (
              <p className="text-xs text-muted-foreground">
                Você não pode alterar seu próprio perfil ou situação.
              </p>
            )}
            <div className="flex justify-end gap-4 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
