import { TabGuard } from "@/app/components/tab-guard";
import { ClearPasswordFlag } from "@/app/components/profile/clear-password-flag";
import { ForcedPasswordChange } from "@/app/components/profile/forced-password-change";
import { Card } from "@/app/components/ui/card";
import { authOptions } from "@/lib/authOptions";
import { getServerApi } from "@/services/api/serverApi";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// Fica fora de (auth-routes): sem menu lateral, o usuário não navega antes de trocar a senha
export default async function ChangePasswordPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Consulta a API, não a sessão: o admin pode ter redefinido a senha depois do login
  let mustChangePassword = false;
  try {
    const apiServer = await getServerApi();
    const { data } = await apiServer.get("me");
    mustChangePassword = data.mustChangePassword === true;
  } catch (error) {
    console.error(error);
  }

  if (!mustChangePassword) {
    if (session.user.mustChangePassword) {
      return <ClearPasswordFlag />;
    }
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-hero">
      <Card className="w-full max-w-md p-6 space-y-4 bg-card-gradient">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Crie sua senha</h1>
          <p className="text-sm text-muted-foreground">
            Você entrou com uma senha temporária. Para continuar, crie uma senha
            só sua.
          </p>
        </div>
        <ForcedPasswordChange />
      </Card>
      {/* Mantém o sinal de vida da aba: sem ele, uma troca lenta seria tratada como navegador fechado */}
      <TabGuard />
    </div>
  );
}
