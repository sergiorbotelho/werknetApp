"use client";
import { Customer } from "@/types/customer";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Header } from "../header";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { CardCustomer } from "./customer-card";
import { CustomerModal } from "./customer-modal";

interface CustomersProps {
  customers: Customer[];
}

export default function Customers({ customers }: CustomersProps) {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const handleCloseModal = () => {
    setIsEditing(false);
    setSelectedCustomer(null);
    setIsModalOpen(false);
  };

  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return customers;
    const t = q.toLowerCase();
    return customers?.filter(
      (c) =>
        c.nome.toLowerCase().includes(t) ||
        c.id?.toString().toLowerCase().includes(t),
    );
  }, [q, customers]);

  const handleEdit = (customer: Customer, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedCustomer(customer);
    setIsEditing(true);
  };

  return (
    <div className="w-full px-4 py-4 sm:px-6 md:px-8 lg:px-10 space-y-4 md:space-y-8 max-w-7xl mx-auto mt-4 md:mt-0">
      <Header
        title="Clientes"
        description="Cadastre e acompanhe seus clientes."
        titleButton="Novo Cliente"
        setIsModalOpen={setIsModalOpen}
      />
      <Card className="p-4 bg-card-gradient">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Buscar cliente…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-10 h-12 w-full"
          />
        </div>
      </Card>
      <CardCustomer filtered={filtered} handleEdit={handleEdit} />
      {(isModalOpen || selectedCustomer !== null) && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={handleCloseModal}
          isEditing={isEditing}
        />
      )}
    </div>
  );
}
