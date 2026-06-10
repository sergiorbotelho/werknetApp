import { Customer } from "@/types/customer";
import { ChevronRight, Mail, MapPin, Phone, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface CardCustomerProps {
  filtered: Customer[];
  handleEdit: (customer: Customer, event: React.MouseEvent) => void;
}

export const CardCustomer = ({ filtered, handleEdit }: CardCustomerProps) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {/* {loading && (
        <div className="col-span-full text-center py-12">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
        </div>
      )} */}

      {filtered.length === 0 && (
        <Card className="col-span-full p-12 text-center -mt-4">
          <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Nenhum cliente cadastrado.</p>
        </Card>
      )}

      {filtered.map((c) => (
        <Card
          key={c.id}
          className="p-4 sm:p-5 hover:shadow-elegant transition-all bg-card-gradient cursor-pointer"
        >
          <div className="flex items-start justify-between ">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-hero text-primary-foreground flex items-center justify-center font-bold shrink-0">
                {c.nome.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <div className="font-semibold truncate">{c.nome}</div>
                {c.totalOs > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {c.totalOs} orde
                    {c.totalOs == 1 ? "m" : "ns"} de serviço
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={(e) => handleEdit(c, e)}
            >
              Editar
            </Button>
          </div>

          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 break-all">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span>{c.telefone}</span>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{c.email}</span>
            </div>

            {c.endereco && (
              <div className="flex items-start gap-2 min-w-0">
                <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />

                <span className="break-words">{c.endereco}</span>
              </div>
            )}
          </div>

          <Link
            href={`/customers/${c.id}`}
            className="mt-4 flex items-center justify-between text-sm font-medium text-accent hover:underline"
          >
            Ver ordens de serviço <ChevronRight className="h-4 w-4" />
          </Link>
        </Card>
      ))}
    </section>
  );
};
