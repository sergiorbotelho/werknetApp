"use client";
import { Customer } from "@/types/customer";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CustomerTable } from "./customer-table";

interface CustomersProps {
  customers: Customer[];
}

export default function Customers({ customers }: CustomersProps) {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenModal = (customer = null) => {
    setSelectedCustomer(customer);

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCustomer(null);
    setIsModalOpen(false);
  };
  console.log(customers);
  // const filteredCustomers = customers?.customers.filter(
  //   (customer) =>
  //     customer.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     customer.telefone.includes(searchTerm) ||
  //     customer.cpf?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     customer.cnpj?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

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
          placeholder="Pesquisar cliente"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <CustomerTable
        customers={customers}
        onEdit={() => {}}
        onDelete={() => {}}
      />
      <div className="w-full"></div>
      {/* {isModalOpen && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={handleCloseModal}
          setRefresh={setRefresh}
        />
      )} */}
    </div>
  );
}
