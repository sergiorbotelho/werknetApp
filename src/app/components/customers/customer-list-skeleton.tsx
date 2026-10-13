import { SkeletonColumn, TableSkeleton } from "../table-skeleton";
import { Skeleton } from "../ui/skeleton";

const avatar = <Skeleton className="h-10 w-10 shrink-0 rounded-full" />;

// Mesmas colunas de customer-card.tsx
const columns: SkeletonColumn[] = [
  {
    header: "Cliente",
    cell: (
      <div className="flex items-center gap-3">
        {avatar}
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    ),
  },
  {
    header: "Contato",
    cell: (
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-40" />
      </div>
    ),
  },
  {
    header: "Cidade",
    className: "hidden xl:table-cell",
    cell: <Skeleton className="h-4 w-24" />,
  },
  { header: "Ordens de serviço", cell: <Skeleton className="h-4 w-16" /> },
  {
    header: "",
    className: "text-right",
    cell: <Skeleton className="ml-auto h-10 w-10" />,
  },
];

// Tabela a partir de lg e cards abaixo, como a lista de clientes
export function CustomerListSkeleton() {
  return (
    <div role="status" aria-label="Carregando clientes">
      <TableSkeleton columns={columns} />

      <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <li
            key={index}
            data-skeleton="card"
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-start gap-3">
              {avatar}
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
            <div className="mt-3 space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-11 flex-1" />
              <Skeleton className="h-11 flex-1" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
