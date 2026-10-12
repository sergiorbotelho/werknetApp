import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { roleLabels, User } from "@/types/user";
import { KeyRound, Mail, UserCog } from "lucide-react";

interface UserCardProps {
  users: User[];
  currentUserId: string;
  onEdit: (user: User) => void;
  onResetPassword: (user: User) => void;
}

export function UserCard({
  users,
  currentUserId,
  onEdit,
  onResetPassword,
}: UserCardProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {users.length === 0 && (
        <Card className="col-span-full p-12 text-center">
          <UserCog className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Nenhum usuário cadastrado.</p>
        </Card>
      )}

      {users.map((u) => (
        <Card key={u.id} className="p-4 sm:p-5 bg-card-gradient space-y-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-hero text-primary-foreground flex items-center justify-center font-bold shrink-0">
              {u.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="font-semibold truncate">
                {u.name}
                {u.id === currentUserId && (
                  <span className="text-xs text-muted-foreground"> (você)</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{u.email}</span>
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>
                  {roleLabels[u.role]}
                </Badge>
                <Badge variant={u.active ? "outline" : "destructive"}>
                  {u.active ? "Ativo" : "Inativo"}
                </Badge>
                {u.mustChangePassword && (
                  <Badge variant="outline">Senha temporária</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onEdit(u)}
            >
              Editar
            </Button>
            {u.id !== currentUserId && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onResetPassword(u)}
              >
                <KeyRound className="h-4 w-4 mr-2" />
                Redefinir senha
              </Button>
            )}
          </div>
        </Card>
      ))}
    </section>
  );
}
