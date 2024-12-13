"use client";

import { useEffect, useState } from "react";
import { CustomerCard } from "../../components/customer-card";
import { CustomerModal } from "../../components/customer-modal";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

import { api } from "@/services/api/api";
import { Customer } from "../../../types/customer";

import { CustomerCardSkeleton } from "@/app/components/skeletonCard";

interface Customers {
  customers: Customer[];
  count: number;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customers>();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      await api
        .get("customers")
        .then((response) => {
          setCustomers(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    };
    loadCustomers();
  }, [refresh]);

  const handleOpenModal = (customer = null) => {
    setSelectedCustomer(customer);

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCustomer(null);
    setIsModalOpen(false);
  };

  const filteredCustomers = customers?.customers.filter(
    (customer) =>
      customer.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.telefone.includes(searchTerm) ||
      customer.cpf?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.cnpj?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className=" flex flex-col mt-10 mx-10 justify-center">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Clientes</h1>
          <Button onClick={() => handleOpenModal()}>Adicionar Cliente</Button>
        </div>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Pesquisar cliente"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array(3)
                .fill(0)
                .map((_, index) => <CustomerCardSkeleton key={index} />)
            : filteredCustomers &&
              filteredCustomers
                .reverse()
                .map((customer) => (
                  <CustomerCard
                    key={customer?.id}
                    customer={customer}
                    onView={() => handleOpenModal(customer)}
                  />
                ))}
        </div>
        {isModalOpen && (
          <CustomerModal
            customer={selectedCustomer}
            onClose={handleCloseModal}
            setRefresh={setRefresh}
          />
        )}
      </div>
    </div>
  );
}
