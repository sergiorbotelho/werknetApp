"use client";
import { CardServiceOrder } from "@/app/components/serviceOrder/serviceorder-card";
import { OrderPdfModal } from "@/app/components/serviceOrder/order-pdf-modal";
import { ServiceOrderModal } from "@/app/components/serviceOrder/serviceorder-modal";
import { SearchInput } from "@/app/components/search-input";
import { Card } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { formatPhone } from "@/helpers/format";
import { initials } from "@/helpers/initials";
import { api } from "@/services/api/api";
import { Customer } from "@/types/customer";
import { IOrderService } from "@/types/order";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "@/lib/toast";

export default function PageCustomer() {
  const [serviceOrders, setServiceOrders] = useState<IOrderService[] | null>(
    null,
  );
  const [customer, setCustomer] = useState<Customer | null>(null);
  // Começam carregando: sem isso, o 1º render mostra a lista vazia
  const [loading, setLoading] = useState(true);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [q, setQ] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pdfOrder, setPdfOrder] = useState<IOrderService | null>(null);

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
        console.error(error);
        toast.error(
          error.response?.data?.message ?? "Erro ao carregar o cliente.",
        );
      })
      .finally(() => setCustomerLoading(false));
  };

  const loadOrderByCustomer = async () => {
    setLoading(true);
    await api
      .get(`os/client/${id}`)
      .then((response) => {
        setServiceOrders(response.data.os);
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          error.response?.data?.message ??
            "Erro ao carregar as ordens de serviço.",
        );
      })
      .finally(() => setLoading(false));
  };
  const handleEdit = (order: IOrderService, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedOrder(order);
    setIsEditing(true);
  };

  const handleViewPdf = (e: React.MouseEvent, order: IOrderService) => {
    e.stopPropagation();
    setPdfOrder(order);
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
            {customer ? initials(customer.nome) : ""}
          </div>
          {customerLoading ? (
            <div
              className="min-w-0 flex-1 space-y-3"
              role="status"
              aria-label="Carregando cliente"
            >
              <Skeleton className="h-9 w-full max-w-[14rem] bg-white/20" />
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-5 w-32 bg-white/20" />
                <Skeleton className="h-5 w-44 bg-white/20" />
                <Skeleton className="h-5 w-40 bg-white/20" />
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{customer?.nome}</h1>
              <div className="flex flex-wrap gap-4 mt-3 text-sm opacity-90">
                {customer?.telefone && (
                  <span className="flex gap-1.5">
                    <Phone className="h-4 w-4" />
                    {formatPhone(customer?.telefone)}
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
          )}
        </div>
      </Card>
      <SearchInput
        value={q}
        onChange={setQ}
        placeholder="Buscar por número, equipamento ou defeito"
      />
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Ordens de Serviço{serviceOrders ? ` (${serviceOrders.length})` : ""}
        </h2>
        <div className="space-y-3">
          <CardServiceOrder
            filtered={filtered}
            loading={loading}
            handleViewPdf={handleViewPdf}
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
      {pdfOrder && (
        <OrderPdfModal order={pdfOrder} onClose={() => setPdfOrder(null)} />
      )}
    </div>
  );
}
