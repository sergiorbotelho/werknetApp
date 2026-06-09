"use client";
import { CardServiceOrder } from "@/app/components/serviceOrder/serviceorder-card";
import { ServiceOrderModal } from "@/app/components/serviceOrder/serviceorder-modal";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import PdfOrder from "@/report/pdfOrder";
import { api } from "@/services/api/api";
import { Customer } from "@/types/customer";
import { IOrderService } from "@/types/order";
import { ArrowLeft, Mail, MapPin, Phone, Search } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

export default function PageCustomer() {
  const [serviceOrders, setServiceOrders] = useState<IOrderService[] | null>(
    [],
  );
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [q, setQ] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    loadCustomer();
    loadOrderByCustomer();
  }, []);

  const loadCustomer = async () => {
    await api(`/customer/${id}`)
      .then((response) => {
        setCustomer(response.data);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const loadOrderByCustomer = async () => {
    setLoading(true);
    await api
      .get(`os/client/${id}`)
      .then((response) => {
        setServiceOrders(response.data.os);
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => setLoading(false));
  };
  const handleEdit = (order: IOrderService, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedOrder(order);
    setIsEditing(true);
  };

  const handlePrintOrder = (e: React.MouseEvent, order: IOrderService) => {
    e.stopPropagation();

    PdfOrder({ order });
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

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-6xl mx-auto container">
      <Link
        href="/customers"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para clientes
      </Link>

      <Card className="p-6 md:p-8 bg-hero text-primary-foreground shadow-glow">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
            {customer?.nome.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{customer?.nome}</h1>
            <div className="flex flex-wrap gap-4 mt-3 text-sm opacity-90">
              {customer?.telefone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" />
                  {customer?.telefone}
                </span>
              )}

              {customer?.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  {customer?.email}
                </span>
              )}

              {customer?.endereco && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {customer?.endereco}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
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
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Ordens de Serviço ({serviceOrders.length})
        </h2>
        <div className="space-y-3">
          <CardServiceOrder
            filtered={filtered}
            loading={loading}
            handlePrintOrder={handlePrintOrder}
            handleEdit={handleEdit}
          />
        </div>
      </div>
      {(isModalOpen || selectedOrder !== null) && (
        <ServiceOrderModal
          order={selectedOrder}
          onClose={handleCloseModal}
          isEditing={isEditing}
          loadOrders={loadOrderByCustomer}
        />
      )}
    </div>
  );
}
