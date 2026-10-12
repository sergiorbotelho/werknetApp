import Users from "@/app/components/users/users";
import { authOptions } from "@/lib/authOptions";
import { getServerApi } from "@/services/api/serverApi";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "ADMIN") {
    redirect("/");
  }

  const apiServer = await getServerApi();
  const { data } = await apiServer.get("users");

  return (
    <div className="max-w-6xl mx-auto w-full">
      <Users users={data.users} currentUserId={session.user.id} />
    </div>
  );
}
