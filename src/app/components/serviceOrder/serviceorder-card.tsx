import { IOrderService } from "@/types/order";
import { Calendar, Printer, UserIcon, Wrench } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { CardSkeleton } from "./serviceorder-skeleton";

interface CardServiceOrderProps {
  loading: boolean;
  filtered: IOrderService[];
  handleEdit: (order: IOrderService, event: React.MouseEvent) => void;
  handlePrintOrder: (e: React.MouseEvent, order: IOrderService) => void;
}

export const CardServiceOrder = ({
  loading,
  filtered,
  handleEdit,
  handlePrintOrder,
}: CardServiceOrderProps) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {loading && (
        <>
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx}>
              <CardSkeleton />
            </div>
          ))}
        </>
      )}

      {!loading && filtered?.length === 0 && (
        <Card className="col-span-full p-12 text-center">
          <Wrench className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            Nenhuma ordem de serviço encontrada.
          </p>
        </Card>
      )}

      {!loading &&
        filtered?.map((os) => (
          <Card
            key={os.id}
            className="p-5 hover:shadow-elegant transition-all bg-card-gradient cursor-pointer group"
            onClick={(e) => handleEdit(os, e)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="h-12 w-12 rounded-xl bg-hero text-primary-foreground flex flex-col items-center justify-center font-bold shrink-0">
                  <span className="text-[9px] opacity-80 leading-none">OS</span>
                  <span className="text-sm leading-tight">#{os.id}</span>
                </div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">
                    {os.modeloEquipamento || "Sem equipamento"}
                  </div>
                  <Badge variant="outline">{os.tipoServico}</Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handlePrintOrder(e, os)}
                title="Imprimir OS"
              >
                <Printer className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 truncate">
                <UserIcon className="h-3.5 w-3.5 shrink-0" />{" "}
                <span className="truncate">
                  {os.client?.nome ?? "Sem cliente"}
                </span>
              </div>
              {os.contato && (
                <div className="flex items-center gap-2 truncate">
                  <span className="truncate">{os.contato}</span>
                </div>
              )}
              {os.defeito && (
                <div className="line-clamp-2 text-foreground/80">
                  {os.defeito}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="h-3.5 w-3.5" />{" "}
                {new Date(os.created_at).toLocaleDateString("pt-BR")}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="font-semibold">
                R${" "}
                {(
                  Number(os.valServico ?? 0) + Number(os.valMaterial ?? 0)
                ).toFixed(2)}
              </span>
            </div>
          </Card>
        ))}
    </section>
  );
};
