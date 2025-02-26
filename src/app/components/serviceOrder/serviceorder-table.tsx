"use client";

import PdfOrder from "@/report/pdfOrder";
import { IOrderService } from "@/types/order";
import dayjs from "dayjs";
import { Pencil, Printer } from "lucide-react";
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
import { ServiceOrderModal } from "./serviceorder-modal";

interface CustomerTableProps {
  services: IOrderService[];
  searchTerm: string;
}

export function ServiceOrderTable({
  searchTerm,
  services,
}: CustomerTableProps) {
  const [selectedService, setSelectedService] = useState<IOrderService | null>(
    null
  );

  const [isEditing, setIsEditing] = useState(false);

  const filteredOrders = services.filter(
    (order) =>
      order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (service: IOrderService) => {
    setSelectedService(service);
    setIsEditing(false);
  };

  const handleEdit = (service: IOrderService, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedService(service);
    setIsEditing(true);
  };

  const handlePrintOrder = (e: React.MouseEvent, order: IOrderService) => {
    e.stopPropagation();

    PdfOrder({ order });
  };

  if (services.length < 1) {
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
              <TableHead className="w-[50px] text-center">OS</TableHead>
              <TableHead className="">Cliente</TableHead>
              <TableHead className="">Modelo</TableHead>
              <TableHead className="">Data de entrada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((service: IOrderService) => (
              <TableRow
                key={service.id}
                onClick={() => handleRowClick(service)}
                className="cursor-pointer "
              >
                <TableCell className="font-medium text-">
                  {service.id}
                </TableCell>
                <TableCell>{service.client.nome}</TableCell>
                <TableCell>{service.modeloEquipamento}</TableCell>
                <TableCell>
                  {dayjs(service.created_at).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell className=" flex text-right">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleEdit(service, e)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Editar OS</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handlePrintOrder(e, service)}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Imprimir OS</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {selectedService !== null && (
          <ServiceOrderModal
            order={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
      </TooltipProvider>
    </ScrollArea>
  );
}
