import { Skeleton } from "./ui/skeleton";

// Espelha o <Header>: título, descrição e botão "Novo …"
export function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 sm:h-9 md:h-10" />
        <Skeleton className="h-4 w-28" />
      </div>
      <Skeleton className="h-11 w-full sm:w-44" />
    </div>
  );
}

// Espelha o <SearchInput>
export function SearchInputSkeleton() {
  return <Skeleton className="h-11 w-full flex-1" />;
}
