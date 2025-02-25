"use client";

import { useEffect, useState } from "react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { api } from "@/services/api/api";
import { toast } from "react-toastify";
import { IOrderService } from "../../../types/order";
import { ServiceOrderTable } from "./serviceorder-table";

export default function ServiceOrders() {
  const [serviceOrders, setServiceOrders] = useState<IOrderService[] | null>(
    []
  );
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewOrder, setIsNewOrder] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      await api
        .get("os")
        .then((response) => {
          setServiceOrders(response.data.os);

          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    };
    loadOrders();
  }, [refresh]);

  const handleOpenModal = (order = null) => {
    setSelectedOrder(order);
    setIsNewOrder(!order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const handleSaveOrder = async (order: IOrderService) => {
    setRefresh(true);
    if (isNewOrder) {
      console.log(order);
    }
    if (!isNewOrder) {
      const { id, client, created_at, ...data } = order;

      await api
        .put(`/os/${id}`, data)
        .then((response) => {
          setRefresh(false);
          toast.success("OS atualizado com sucesso");
        })
        .catch((error) => {
          setRefresh(false);
          console.error(error);
        });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className=" flex flex-col mt-10 mx-10 justify-center">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Ordem de serviço</h1>
          <Button onClick={() => handleOpenModal()} className="text-white">
            Criar ordem de serviço
          </Button>
        </div>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Pesquisar ordem de serviço"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <ServiceOrderTable services={serviceOrders} searchTerm={searchTerm} />
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array(3)
                .fill(0)
                .map((_, index) => <ServiceOrderSkeleton key={index} />)
            : filteredOrders
                .reverse()
                .map((order) => (
                  <ServiceOrderCard
                    key={order.id}
                    order={order}
                    onView={() => handleOpenModal(order)}
                    onPrint={() => PdfOrder({ order })}
                  />
                ))}
        </div> */}
        {/* {isModalOpen && (
          <ServiceOrderModal
            order={selectedOrder}
            onClose={handleCloseModal}
            onSave={handleSaveOrder}
          />
        )} */}
      </div>
    </div>
  );
}
