"use client";

import { useEffect, useMemo, useState } from "react";

import { api } from "@/services/api/api";
import { IOrderService } from "../../../types/order";
import { Header } from "../header";
import { SearchInput } from "../search-input";
import { OrderPdfModal } from "./order-pdf-modal";
import { CardServiceOrder } from "./serviceorder-card";
import { ServiceOrderModal } from "./serviceorder-modal";

export default function ServiceOrders() {
  const [serviceOrders, setServiceOrders] = useState<IOrderService[] | null>(
    null,
  );
  const [selectedOrder, setSelectedOrder] = useState(null);
  // Começa carregando: sem isso, o 1º render mostra "nenhuma OS encontrada"
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [q, setQ] = useState("");
  const [pdfOrder, setPdfOrder] = useState<IOrderService | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);
  const loadOrders = async () => {
    setLoading(true);
    await api
      .get("/os")
      .then((response) => {
        setServiceOrders(response.data.os.toReversed());
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        // setInitialState(false);
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

  const handleViewPdf = (e: React.MouseEvent, order: IOrderService) => {
    e.stopPropagation();
    setPdfOrder(order);
  };

  return (
    <div className="mx-auto mt-4 w-full max-w-7xl space-y-6 px-4 py-4 sm:px-6 md:mt-0 md:px-8 lg:px-10 lg:py-8">
      <Header
        title="Ordens de serviço"
        description={
          serviceOrders === null
            ? "Carregando atendimentos…"
            : `${serviceOrders.length} ${
                serviceOrders.length === 1
                  ? "ordem de serviço"
                  : "ordens de serviço"
              }`
        }
        titleButton="Nova ordem de serviço"
        setIsModalOpen={setIsModalOpen}
      />

      <SearchInput
        value={q}
        onChange={setQ}
        placeholder="Buscar por número, cliente, equipamento ou defeito"
      />

      <CardServiceOrder
        loading={loading}
        filtered={filtered}
        handleEdit={handleEdit}
        handleViewPdf={handleViewPdf}
      />
      {(isModalOpen || selectedOrder !== null) && (
        <ServiceOrderModal
          order={selectedOrder}
          onClose={handleCloseModal}
          isEditing={isEditing}
          loadOrders={loadOrders}
        />
      )}
      {pdfOrder && (
        <OrderPdfModal order={pdfOrder} onClose={() => setPdfOrder(null)} />
      )}
    </div>
  );
}
