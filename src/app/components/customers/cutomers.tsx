"use client";
import { api } from "@/services/api/api";
import { Customer } from "@/types/customer";
import {
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { CustomerModal } from "./customer-modal";

interface CustomersProps {
  customers: Customer[];
}

type Cliente = {
  id: string;
  nome: string;
  contato: string | null;
  email: string | null;
  endereco: string | null;
  observacoes: string | null;
  os_count?: number;
};

export default function Customers() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    loadCustomers();
  }, []);
  const handleOpenModal = (customer = null) => {
    setSelectedCustomer(customer);

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCustomer(null);
    setIsModalOpen(false);
  };

  const loadCustomers = async () => {
    setLoading(true);
    await api
      .get("/customers")
      .then((response) => {
        setCustomers(response.data.customers);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return customers;
    const t = q.toLowerCase();
    return customers.filter(
      (c) =>
        c.nome.toLowerCase().includes(t) ||
        c.id?.toString().toLowerCase().includes(t),
    );
  }, [q, customers]);

  const handleEdit = (customer: Customer, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedCustomer(customer);
    setIsEditing(true);
  };

  return (
    <div className="w-full px-4 py-4 sm:px-6 md:px-8 lg:px-10 space-y-4 md:space-y-8 max-w-7xl mx-auto mt-4 md:mt-0">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground break-words">
            Clientes
          </h1>
          <p className="text-sm text-muted-foreground">
            Cadastre e acompanhe seus clientes.
          </p>
        </div>

        <Button
          size="lg"
          className="w-full sm:w-auto shadow-elegant justify-center transition-transform active:scale-95"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2 shrink-0" />
          Novo Cliente
        </Button>
      </header>

      <Card className="p-4 bg-card-gradient">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Buscar cliente…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-10 h-12 w-full"
          />
        </div>
      </Card>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading && (
          <div className="col-span-full text-center py-12">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <Card className="col-span-full p-12 text-center">
            <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Nenhum cliente cadastrado.</p>
          </Card>
        )}

        {filtered.map((c) => (
          <Card
            key={c.id}
            className="p-4 sm:p-5 hover:shadow-elegant transition-all bg-card-gradient group cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-hero text-primary-foreground flex items-center justify-center font-bold shrink-0">
                  {c.nome.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate">{c.nome}</div>

                  <div className="text-xs text-muted-foreground">
                    2 ordem(ns) de serviço
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="shrink-0"
                onClick={(e) => handleEdit(c, e)}
              >
                Editar
              </Button>
            </div>

            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              {c.telefone && (
                <div className="flex items-center gap-2 break-all">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{c.telefone}</span>
                </div>
              )}

              {c.cpf ||
                (c.cnpj && (
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">sergio@gmail.com</span>
                  </div>
                ))}

              {c.endereco && (
                <div className="flex items-start gap-2 min-w-0">
                  <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />

                  <span className="break-words">{c.endereco}</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </section>

      {(isModalOpen || selectedCustomer !== null) && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={handleCloseModal}
          isEditing={isEditing}
        />
      )}
    </div>
  );
}
