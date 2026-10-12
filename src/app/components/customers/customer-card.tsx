import { formatDocument, formatPhone } from "@/helpers/format";
import { initials } from "@/helpers/initials";
import { Customer } from "@/types/customer";
import { ClipboardList, Mail, Pencil, Phone, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface CardCustomerProps {
  filtered: Customer[];
  handleEdit: (customer: Customer, event: React.MouseEvent) => void;
}

function CustomerAvatar({ customer }: { customer: Customer }) {
  return (
    <div
      aria-hidden
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold tracking-tight text-secondary-foreground"
    >
      {initials(customer.nome)}
    </div>
  );
}

function osCountLabel(total: number) {
  if (!total) return "Nenhuma OS";
  return `${total} OS`;
}

function cityLabel(customer: Customer) {
  if (customer.cidade && customer.uf) return `${customer.cidade}/${customer.uf}`;
  return customer.cidade || customer.uf || "";
}

export const CardCustomer = ({ filtered, handleEdit }: CardCustomerProps) => {
  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <Users className="h-8 w-8 text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground">
          Nenhum cliente encontrado.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Telas grandes: tabela */}
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card lg:block">
        <table className="w-full text-left">
          <thead className="border-b border-border bg-secondary text-xs font-semibold text-secondary-foreground">
            <tr>
              <th scope="col" className="px-5 py-3">
                Cliente
              </th>
              <th scope="col" className="px-5 py-3">
                Contato
              </th>
              <th scope="col" className="hidden px-5 py-3 xl:table-cell">
                Cidade
              </th>
              <th scope="col" className="px-5 py-3">
                Ordens de serviço
              </th>
              <th scope="col" className="px-5 py-3 text-right">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((c) => {
              const document = formatDocument(c.cpf, c.cnpj);
              return (
                <tr key={c.id} className="transition-colors hover:bg-muted">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <CustomerAvatar customer={c} />
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground">
                          {c.nome}
                        </div>
                        {document && (
                          <div className="text-sm tabular-nums text-muted-foreground">
                            {document}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <div className="whitespace-nowrap tabular-nums text-foreground">
                      {formatPhone(c.telefone)}
                    </div>
                    {c.email && (
                      <div className="break-all text-muted-foreground">
                        {c.email}
                      </div>
                    )}
                  </td>
                  <td className="hidden px-5 py-4 text-sm text-muted-foreground xl:table-cell">
                    {cityLabel(c)}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/customers/${c.id}`}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <ClipboardList className="h-4 w-4" aria-hidden />
                      {osCountLabel(c.totalOs)}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleEdit(c, e)}
                        aria-label={`Editar ${c.nome}`}
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Celular e tablet: um cartão por cliente */}
      <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:hidden">
        {filtered.map((c) => {
          const document = formatDocument(c.cpf, c.cnpj);
          const city = cityLabel(c);
          return (
            <li
              key={c.id}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-start gap-3">
                <CustomerAvatar customer={c} />
                <div className="min-w-0">
                  <div className="font-semibold text-foreground">{c.nome}</div>
                  {document && (
                    <div className="text-sm tabular-nums text-muted-foreground">
                      {document}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {c.telefone && (
                  <div className="flex items-center gap-2 tabular-nums">
                    <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {formatPhone(c.telefone)}
                  </div>
                )}
                {c.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span className="break-all">{c.email}</span>
                  </div>
                )}
                {city && <div>{city}</div>}
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  className="h-11 flex-1"
                  onClick={(e) => handleEdit(c, e)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button variant="outline" className="h-11 flex-1" asChild>
                  <Link href={`/customers/${c.id}`}>
                    <ClipboardList className="mr-2 h-4 w-4" />
                    {osCountLabel(c.totalOs)}
                  </Link>
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};
