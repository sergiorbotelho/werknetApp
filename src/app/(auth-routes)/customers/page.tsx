import Customers from "@/app/components/customers/cutomers";
import { LoadingSpinner } from "@/app/components/ui/loading";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
export default async function CustomersPage() {
  const session = await getServerSession(authOptions); // Obtém a sessão
  const token = session?.user?.token; // Ajuste conforme a estrutura da sua sessão
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/customers`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    cache: "no-cache",
  });

  const { customers } = await response.json();
  if (!customers) {
    return (
      <div className="flex justify-center items-center h-full max-w-6xl mx-auto w-full">
        <LoadingSpinner size={60} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <Customers customers={customers} />
    </div>
  );
}
