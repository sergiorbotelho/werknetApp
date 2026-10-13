import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface SkeletonColumn {
  // Mesmo texto do <th> da tabela real; vazio é a coluna de ações
  header: string;
  // Classes do <th>/<td> real (ex.: "hidden xl:table-cell", "text-right")
  className?: string;
  cell: ReactNode;
}

interface TableSkeletonProps {
  columns: SkeletonColumn[];
  rows?: number;
}

// Mesma moldura, cabeçalho e colunas das tabelas reais. Como elas, só aparece
// a partir de lg; abaixo disso cada lista mostra o skeleton dos seus cards.
export function TableSkeleton({ columns, rows = 6 }: TableSkeletonProps) {
  return (
    <div
      data-skeleton="table"
      className="hidden overflow-hidden rounded-xl border border-border bg-card lg:block"
    >
      <table className="w-full text-left">
        <thead className="border-b border-border bg-secondary text-xs font-semibold text-secondary-foreground">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={cn("px-5 py-3", column.className)}
              >
                {column.header || <span className="sr-only">Ações</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, row) => (
            <tr key={row}>
              {columns.map((column, index) => (
                <td key={index} className={cn("px-5 py-4", column.className)}>
                  {column.cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
