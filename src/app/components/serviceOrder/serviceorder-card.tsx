import { formatBRL, formatDate } from "@/helpers/format";
import { cn } from "@/lib/utils";
import { IOrderService, serviceTypeLabels } from "@/types/order";
import { FileText, Pencil, Wrench } from "lucide-react";
import { Button } from "../ui/button";
import { CardSkeleton } from "./serviceorder-skeleton";

interface CardServiceOrderProps {
  loading: boolean;
  filtered: IOrderService[];
  handleEdit: (order: IOrderService, event: React.MouseEvent) => void;
  handleViewPdf: (e: React.MouseEvent, order: IOrderService) => void;
}

// A cor do tipo ajuda a separar garantia, orçamento e contrato numa olhada
const serviceTypeStyles: Record<string, string> = {
  GARANTIA: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200",
  FORADEGARANTIA: "bg-secondary text-secondary-foreground",
  ORCAMENTO: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200",
  CONTRATO: "bg-primary text-primary-foreground",
};

function orderTotal(os: IOrderService) {
  if (os.total != null && os.total !== "") return Number(os.total);
  return Number(os.valServico ?? 0) + Number(os.valMaterial ?? 0);
}

function ServiceTypeTag({ type }: { type: string }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-semibold",
        serviceTypeStyles[type] ?? "bg-secondary text-secondary-foreground",
      )}
    >
      {serviceTypeLabels[type] ?? type}
    </span>
  );
}

function TableSkeleton() {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-border bg-card lg:block">
      <div className="h-11 border-b border-border bg-secondary" />
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="flex items-center gap-6 border-b border-border px-5 py-5 last:border-b-0"
        >
          <div className="h-4 w-12 animate-pulse rounded bg-muted" />
          <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
          <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

export const CardServiceOrder = ({
  loading,
  filtered,
  handleEdit,
  handleViewPdf,
}: CardServiceOrderProps) => {
  if (loading) {
    return (
      <>
        <TableSkeleton />
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:hidden">
          {Array.from({ length: 4 }).map((_, idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>
      </>
    );
  }

  if (!filtered || filtered.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <Wrench className="h-8 w-8 text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground">
          Nenhuma ordem de serviço encontrada.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Telas grandes: tabela. Clicar na linha abre a OS, como antes */}
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card lg:block">
        <table className="w-full text-left">
          <thead className="border-b border-border bg-secondary text-xs font-semibold text-secondary-foreground">
            <tr>
              <th scope="col" className="px-5 py-3">
                Nº
              </th>
              <th scope="col" className="px-5 py-3">
                Cliente
              </th>
              <th scope="col" className="px-5 py-3">
                Equipamento e defeito
              </th>
              <th scope="col" className="px-5 py-3">
                Tipo
              </th>
              <th scope="col" className="hidden px-5 py-3 xl:table-cell">
                Data
              </th>
              <th scope="col" className="px-5 py-3 text-right">
                Total
              </th>
              <th scope="col" className="px-5 py-3 text-right">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((os) => (
              <tr
                key={os.id}
                onClick={(e) => handleEdit(os, e)}
                className="cursor-pointer align-top transition-colors hover:bg-muted"
              >
                <td className="whitespace-nowrap px-5 py-4 font-bold tabular-nums text-foreground">
                  #{os.id}
                </td>
                <td className="px-5 py-4">
                  <div className="font-medium text-foreground">
                    {os.client?.nome ?? "Sem cliente"}
                  </div>
                  {os.contato && (
                    <div className="text-sm text-muted-foreground">
                      {os.contato}
                    </div>
                  )}
                </td>
                <td className="max-w-xs px-5 py-4">
                  <div className="font-medium text-foreground">
                    {os.modeloEquipamento || "Sem equipamento"}
                  </div>
                  {os.defeito && (
                    <div className="line-clamp-1 text-sm text-muted-foreground">
                      {os.defeito}
                    </div>
                  )}
                </td>
                <td className="px-5 py-4">
                  <ServiceTypeTag type={os.tipoServico} />
                </td>
                <td className="hidden whitespace-nowrap px-5 py-4 text-sm text-muted-foreground xl:table-cell">
                  {formatDate(os.created_at)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-right font-semibold tabular-nums text-foreground">
                  {formatBRL(orderTotal(os))}
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleViewPdf(e, os)}
                      aria-label={`Ver PDF da OS ${os.id}`}
                      title="Ver PDF"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleEdit(os, e)}
                      aria-label={`Editar OS ${os.id}`}
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Celular e tablet: um cartão por OS */}
      <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:hidden">
        {filtered.map((os) => (
          <li
            key={os.id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-lg font-bold tabular-nums text-foreground">
                  OS #{os.id}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(os.created_at)}
                </div>
              </div>
              <ServiceTypeTag type={os.tipoServico} />
            </div>

            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="sr-only">Cliente</dt>
                <dd className="font-medium text-foreground">
                  {os.client?.nome ?? "Sem cliente"}
                  {os.contato && (
                    <span className="font-normal text-muted-foreground">
                      {" "}
                      ({os.contato})
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="sr-only">Equipamento</dt>
                <dd className="text-foreground">
                  {os.modeloEquipamento || "Sem equipamento"}
                </dd>
              </div>
              {os.defeito && (
                <div>
                  <dt className="sr-only">Defeito</dt>
                  <dd className="line-clamp-2 text-muted-foreground">
                    {os.defeito}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-semibold tabular-nums text-foreground">
                {formatBRL(orderTotal(os))}
              </span>
            </div>

            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                className="h-11 flex-1"
                onClick={(e) => handleEdit(os, e)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                className="h-11 flex-1"
                onClick={(e) => handleViewPdf(e, os)}
              >
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
