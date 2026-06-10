"use server";
import Customers from "@/app/components/customers/cutomers";
import { getServerApi } from "@/services/api/serverApi";
export default async function CustomersPage() {
  const apiServer = await getServerApi();
  const customers = await apiServer.get(`customers`);

  return (
    <div className="max-w-6xl mx-auto w-full">
      <Customers customers={customers.data.customers} />
    </div>
  );
}
