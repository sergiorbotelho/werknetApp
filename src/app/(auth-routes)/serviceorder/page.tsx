"use client";

import { useEffect, useState } from "react";

// import { ServiceOrderModal } from '../components/service-order-modal'
// import { ConfirmationModal } from '../components/confirmation-modal'
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import SheetMenu from "@/app/components/sheetGlobal";
import { ServiceOrderCard } from "@/app/components/service-card";
import { api } from "@/services/api/api";
import { ServiceOrderSkeleton } from "@/app/components/skeletonOs";
import { IOrderService } from "../../../../types/order";
import PdfOrder from "@/report/pdfOrder";

const mockServiceOrders = [
  {
    id: 1,
    number: "OS001",
    customerName: "John Doe",
    equipmentModel: "Laptop XYZ",
    issue: "Wont turn on",
  },
  {
    id: 2,
    number: "OS002",
    customerName: "Jane Smith",
    equipmentModel: "Printer ABC",
    issue: "Paper jam",
  },
  {
    id: 3,
    number: "OS003",
    customerName: "Bob Johnson",
    equipmentModel: "Smartphone Model X",
    issue: "Cracked screen",
  },
];

export default function ServiceOrdersPage() {
  const [serviceOrders, setServiceOrders] = useState<IOrderService[] | null>(
    []
  );
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewOrder, setIsNewOrder] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
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
  }, [loading]);

  const handleOpenModal = (order = null) => {
    setSelectedOrder(order);
    setIsNewOrder(!order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const handleSaveOrder = (order) => {
    if (isNewOrder) {
      setServiceOrders([
        ...serviceOrders,
        {
          ...order,
          id: serviceOrders.length + 1,
          number: `OS${(serviceOrders.length + 1).toString().padStart(3, "0")}`,
        },
      ]);
    } else {
      setServiceOrders(
        serviceOrders.map((o) => (o.id === order.id ? order : o))
      );
    }
    handleCloseModal();
  };

  const filteredOrders = serviceOrders.filter(
    (order) =>
      order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <SheetMenu />
      <div className=" flex flex-col mt-10 mx-10 justify-center">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Ordem de serviço</h1>
          <Button onClick={() => handleOpenModal()}>
            Criar ordem de serviço
          </Button>
        </div>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search service orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array(3)
                .fill(0)
                .map((_, index) => <ServiceOrderSkeleton key={index} />)
            : filteredOrders.map((order) => (
                <ServiceOrderCard
                  key={order.id}
                  order={order}
                  onView={() => handleOpenModal(order)}
                  onPrint={() => PdfOrder({ order })}
                />
              ))}
        </div>
        {/* {isModalOpen && (
        <ServiceOrderModal
          order={selectedOrder}
          onClose={handleCloseModal}
          onSave={handleSaveOrder}
        />
      )} */}
        {/* <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={confirmDeleteOrder}
        title="Delete Service Order"
        message="Are you sure you want to delete this service order? This action cannot be undone."
      /> */}
      </div>
    </div>
  );
}
