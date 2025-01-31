"use client";

import { Customer } from "@/types/customer";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
}

export function CustomerTable({
  onEdit,
  onDelete,
  customers,
}: CustomerTableProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);
  const [tableCustomers, setTableCustomers] = useState<Customer[]>([]);

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

  const handleDelete = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setCustomerToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (customerToDelete !== null) {
      onDelete(customerToDelete);
      setIsDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">Id</TableHead>
            <TableHead className="">Nome</TableHead>
            <TableHead className="">Telefone</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow>
              <TableCell className="font-medium text-center">
                {customer.id}
              </TableCell>
              <TableCell>{customer.nome}</TableCell>
              <TableCell>{customer.telefone}</TableCell>
              <TableCell>sergiorbotelho@gmail.com</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleEdit(customer, e)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleDelete(customer.id!, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
