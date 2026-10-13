import { SkeletonColumn, TableSkeleton } from "../table-skeleton";
import { Skeleton } from "../ui/skeleton";

// Mesmas colunas de serviceorder-card.tsx. Nas colunas de texto as barras usam
// w-full + max-w: largura fixa não encolhe na tabela e estouraria a página em lg
const columns: SkeletonColumn[] = [
  { header: "Nº", cell: <Skeleton className="h-4 w-10" /> },
  {
    header: "Cliente",
    cell: (
      <div className="space-y-2">
        <Skeleton className="h-5 w-full max-w-[8rem]" />
        <Skeleton className="h-4 w-full max-w-[5rem]" />
      </div>
    ),
  },
  {
    header: "Equipamento e defeito",
    className: "max-w-xs",
    cell: (
      <div className="space-y-2">
        <Skeleton className="h-5 w-full max-w-[9rem]" />
        <Skeleton className="h-4 w-full max-w-[12rem]" />
      </div>
    ),
  },
  {
    header: "Tipo",
    cell: <Skeleton className="h-5 w-full max-w-[6rem]" />,
  },
  {
    header: "Data",
    className: "hidden xl:table-cell",
    cell: <Skeleton className="h-4 w-20" />,
  },
  {
    header: "Total",
    className: "text-right",
    cell: <Skeleton className="ml-auto h-4 w-full max-w-[5rem]" />,
  },
  {
    header: "",
    className: "text-right",
    cell: (
      <div className="flex justify-end gap-1">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>
    ),
  },
];

// Tabela a partir de lg e cards abaixo, como a lista de OS
export function ServiceOrderListSkeleton() {
  return (
    <div role="status" aria-label="Carregando ordens de serviço">
      <TableSkeleton columns={columns} />

      <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <li
            key={index}
            data-skeleton="card"
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="mt-3 space-y-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="mt-3 flex gap-2">
              <Skeleton className="h-11 flex-1" />
              <Skeleton className="h-11 flex-1" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
