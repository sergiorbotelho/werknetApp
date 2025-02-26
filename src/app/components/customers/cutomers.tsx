"use client";
import { api } from "@/services/api/api";
import { Customer } from "@/types/customer";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CustomerModal } from "./customer-modal";
import { CustomerTable } from "./customer-table";

interface CustomersProps {
  customers: Customer[];
}

export default function Customers() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);
  const handleOpenModal = (customer = null) => {
    setSelectedCustomer(customer);

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCustomer(null);
    setIsModalOpen(false);
  };

  const loadCustomers = async () => {
    setLoading(true);
    await api
      .get("/customers")
      .then((response) => {
        setCustomers(response.data.customers);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className=" flex flex-col mt-10 justify-center min-w-96 mx-auto px-4">
      <div className="flex justify-between  items-center mb-6">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button onClick={() => handleOpenModal()} className="text-white">
          Adicionar Cliente
        </Button>
      </div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Pesquise por Nome/Telefone/CPF/CNPJ"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <CustomerTable customers={customers} searchTerm={searchTerm} />
      <div className="w-full"></div>
      {isModalOpen && (
        <CustomerModal customer={selectedCustomer} onClose={handleCloseModal} />
      )}
    </div>
  );
}
