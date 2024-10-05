"use client";

import { useEffect, useState } from "react";
import { CustomerCard } from "../../components/customer-card";
import { CustomerModal } from "../../components/customer-modal";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

import SheetMenu from "@/app/components/sheetGlobal";
import { api } from "@/services/api/api";
import { Customer } from "../../../../types/customer";

import { CustomerCardSkeleton } from "@/app/components/skeletonCard";
import { toast } from "react-toastify";

interface Customers {
  customers: Customer[];
  count: number;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customers>();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(false);

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
  }, [loading]);

  const handleOpenModal = (customer = null) => {
    setSelectedCustomer(customer);
    setIsNewCustomer(!customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCustomer(null);
    setIsModalOpen(false);
  };

  const handleSaveCustomer = async (customer: Customer) => {
    setLoading(true);
    if (isNewCustomer) {
      await api
        .post("/client", customer)
        .then((response) => {
          setLoading(false);
          toast.success("Cliente cadastrado com sucesso");
          handleCloseModal();
        })
        .catch((error) => {
          console.error(error);
        });
    }
    if (!isNewCustomer) {
      const { id, ...data } = customer;
      console.log(data);

      await api
        .put(`/client/${customer.id}`, data)
        .then((response) => {
          setLoading(false);
          toast.success("Cliente atualizado com sucesso");
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
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
      <SheetMenu />
      <div className=" flex flex-col md:mt-80 mt-20 mx-10 justify-center">
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
              filteredCustomers.map((customer) => (
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
            onSave={handleSaveCustomer}
          />
        )}
      </div>
    </div>
  );
}
