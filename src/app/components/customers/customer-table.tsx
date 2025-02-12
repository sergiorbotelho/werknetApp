"use client";

import { Customer } from "@/types/customer";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
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
  onEdit: (customer: Customer) => void;
  searchTerm: string;
}

export function CustomerTable({
  onEdit,
  searchTerm,
  customers,
}: CustomerTableProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);

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
    setEditedCustomer(customer);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedCustomer) {
      onEdit(editedCustomer);
      setIsEditing(false);
      setSelectedCustomer(null);
      setEditedCustomer(null);
    }
  };

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
          />
        )}
        {/* <Dialog
          open={selectedCustomer !== null}
          onOpenChange={(open) => !open && setSelectedCustomer(null)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Editar Cliente" : "Detalhes do Cliente"}
              </DialogTitle>
            </DialogHeader>
            {selectedCustomer && (
              <div className="grid gap-4 py-4">
                {Object.entries(selectedCustomer).map(
                  ([key, value]) =>
                    key !== "id" && (
                      <div
                        key={key}
                        className="grid grid-cols-4 items-center gap-4"
                      >
                        <Label htmlFor={key} className="text-right">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Label>
                        {isEditing ? (
                          <Input
                            id={key}
                            value={
                              editedCustomer?.[key as keyof Customer] || ""
                            }
                            onChange={(e) =>
                              setEditedCustomer((prev) => ({
                                ...prev!,
                                [key]: e.target.value,
                              }))
                            }
                            className="col-span-3"
                          />
                        ) : (
                          <span className="col-span-3">{value}</span>
                        )}
                      </div>
                    )
                )}
              </div>
            )}
            <DialogFooter>
              {isEditing ? (
                <>
                  <Button onClick={() => setIsEditing(false)}>Cancelar</Button>
                  <Button onClick={handleSave}>Salvar</Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setSelectedCustomer(null)}>
                    Fechar
                  </Button>
                  <Button onClick={() => setIsEditing(true)}>Editar</Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
      </TooltipProvider>
    </ScrollArea>
  );
}
