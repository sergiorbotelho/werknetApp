"use client";

import { useEffect, useMemo, useState } from "react";

import { Input } from "@/app/components/ui/input";
import PdfOrder from "@/report/pdfOrder";
import { api } from "@/services/api/api";
import { Search } from "lucide-react";
import { IOrderService } from "../../../types/order";
import { Header } from "../header";
import { Card } from "../ui/card";
import { CardServiceOrder } from "./serviceorder-card";
import { ServiceOrderModal } from "./serviceorder-modal";

export default function ServiceOrders() {
  const [serviceOrders, setServiceOrders] = useState<IOrderService[] | null>(
    [],
  );
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);
  const loadOrders = async () => {
    setLoading(true);
    await api
      .get("/os")
      .then((response) => {
        setServiceOrders(response.data.os.toReversed());
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const filtered = useMemo(() => {
    if (!q.trim()) return serviceOrders;
    const t = q.toLowerCase();
    return serviceOrders.filter(
      (o) =>
        String(o.id).includes(t) ||
        o.modeloEquipamento?.toLowerCase().includes(t) ||
        o.defeito?.toLowerCase().includes(t) ||
        o.contato?.toLowerCase().includes(t) ||
        o.client?.nome.toLowerCase().includes(t),
    );
  }, [q, serviceOrders]);

  const handleEdit = (order: IOrderService, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedOrder(order);
    setIsEditing(true);
  };

  const handlePrintOrder = (e: React.MouseEvent, order: IOrderService) => {
    e.stopPropagation();

    PdfOrder({ order });
  };

  return (
    <div className="w-full px-4 py-4 sm:px-6 md:px-8 lg:px-10 space-y-4 md:space-y-8 max-w-7xl mx-auto mt-4 md:mt-0">
      <Header
        title="Ordem de serviço"
        description="Acompanhe e gerencie todos os seus atendimentos"
        titleButton="Nova Ordem de serviço"
        setIsModalOpen={setIsModalOpen}
      />

      <Card className="p-4 bg-card-gradient">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número, cliente, equipamento, defeito…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
      </Card>

      <CardServiceOrder
        loading={loading}
        filtered={filtered}
        handleEdit={handleEdit}
        handlePrintOrder={handlePrintOrder}
      />
      {(isModalOpen || selectedOrder !== null) && (
        <ServiceOrderModal
          order={selectedOrder}
          onClose={handleCloseModal}
          isEditing={isEditing}
          loadOrders={loadOrders}
        />
      )}
    </div>
  );
}
