"use client";

import { Customer } from "@/types/customer";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { LoadingSpinner } from "../ui/loading";
import { ScrollArea } from "../ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { CustomerModal } from "./customer-modal";
interface CustomerTableProps {
  customers: Customer[];
  searchTerm: string;
}

export function CustomerTable({ searchTerm, customers }: CustomerTableProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  const filteredCustomers = customers?.filter(
    (customer) =>
      customer.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.telefone.includes(searchTerm) ||
      customer.cpf?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.cnpj?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditing(false);
  };

  const handleEdit = (customer: Customer, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedCustomer(customer);
    setIsEditing(true);
  };

  if (customers.length < 1) {
    return (
      <div className="flex justify-center items-center h-[600px] max-w-6xl mx-auto w-full">
        <LoadingSpinner size={60} />
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] ">
      <TooltipProvider>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">Id</TableHead>
              <TableHead className="">Nome</TableHead>
              <TableHead className="">Telefone</TableHead>
              <TableHead className="">CPF / CNPJ</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow
                key={customer.id}
                onClick={() => handleRowClick(customer)}
                className="cursor-pointer "
              >
                <TableCell className="font-medium text-">
                  {customer.id}
                </TableCell>
                <TableCell>{customer.nome}</TableCell>
                <TableCell>{customer.telefone}</TableCell>
                <TableCell>
                  {customer.cpf?.trim() ? customer.cpf : customer.cnpj}
                </TableCell>
                <TableCell>sergiorbotelho@gmail.com</TableCell>
                <TableCell className="text-right">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleEdit(customer, e)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Editar cliente</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {selectedCustomer !== null && (
          <CustomerModal
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
            isEditing={isEditing}
          />
        )}
      </TooltipProvider>
    </ScrollArea>
  );
}
