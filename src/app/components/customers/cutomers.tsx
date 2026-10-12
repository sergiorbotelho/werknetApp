"use client";
import { Customer } from "@/types/customer";
import { useMemo, useState } from "react";
import { Header } from "../header";
import { SearchInput } from "../search-input";
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
    const t = q.trim().toLowerCase();
    // Telefone e documento são gravados só com dígitos: compara sem a máscara
    const digits = t.replace(/\D/g, "");
    return customers?.filter(
      (c) =>
        c.nome.toLowerCase().includes(t) ||
        c.email?.toLowerCase().includes(t) ||
        c.id?.toString().includes(t) ||
        (digits.length >= 3 &&
          [c.telefone, c.cpf, c.cnpj].some((value) =>
            value?.replace(/\D/g, "").includes(digits),
          )),
    );
  }, [q, customers]);

  const handleEdit = (customer: Customer, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedCustomer(customer);
    setIsEditing(true);
  };

  return (
    <div className="mx-auto mt-4 w-full max-w-7xl space-y-6 px-4 py-4 sm:px-6 md:mt-0 md:px-8 lg:px-10 lg:py-8">
      <Header
        title="Clientes"
        description={`${customers.length} ${
          customers.length === 1 ? "cliente" : "clientes"
        }`}
        titleButton="Novo cliente"
        setIsModalOpen={setIsModalOpen}
      />
      <SearchInput
        value={q}
        onChange={setQ}
        placeholder="Buscar por nome, telefone, e-mail ou CPF/CNPJ"
      />
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
