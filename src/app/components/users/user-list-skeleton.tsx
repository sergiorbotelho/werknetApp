import { SkeletonColumn, TableSkeleton } from "../table-skeleton";
import { Skeleton } from "../ui/skeleton";

// Mesmas colunas de user-list.tsx
const columns: SkeletonColumn[] = [
  {
    header: "Usuário",
    cell: (
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-44" />
        </div>
      </div>
    ),
  },
  { header: "Perfil", cell: <Skeleton className="h-5 w-14" /> },
  { header: "Situação", cell: <Skeleton className="h-4 w-20" /> },
  {
    header: "Cadastro",
    className: "hidden xl:table-cell",
    cell: <Skeleton className="h-4 w-24" />,
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

// Tabela a partir de lg e cards abaixo, como a lista de usuários
export function UserListSkeleton() {
  return (
    <div role="status" aria-label="Carregando usuários">
      <TableSkeleton columns={columns} />

      <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <li
            key={index}
            data-skeleton="card"
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-start gap-3">
              <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-44" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4">
              <Skeleton className="h-5 w-14" />
              <Skeleton className="h-4 w-20" />
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
