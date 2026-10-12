import { Profile } from "@/app/components/profile/profile";
import { getServerApi } from "@/services/api/serverApi";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const apiServer = await getServerApi();
  const { data: me } = await apiServer.get("me");

  // A senha pode ter sido redefinida pelo admin com a sessão aberta
  if (me.mustChangePassword) {
    redirect("/alterar-senha");
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <Profile me={me} />
    </div>
  );
}
