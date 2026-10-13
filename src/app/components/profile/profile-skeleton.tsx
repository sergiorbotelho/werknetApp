import { Skeleton } from "../ui/skeleton";

function FieldSkeleton() {
  return (
    <div className="grid gap-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

// Espelha profile.tsx: capa, avatar sobre a borda e as colunas Seus dados e Senha
export function ProfileSkeleton() {
  return (
    <div className="w-full pb-12" role="status" aria-label="Carregando perfil">
      <div className="h-32 bg-hero sm:h-44" aria-hidden />

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-8">
        <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
          <Skeleton className="h-24 w-24 shrink-0 rounded-full ring-[6px] ring-background sm:h-32 sm:w-32" />
          <div className="space-y-3 sm:pb-2">
            <Skeleton className="h-8 w-56 sm:h-10 sm:w-72" />
            <div className="flex flex-wrap items-center gap-4">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-10 border-t border-border pt-10 lg:grid-cols-2 lg:gap-0">
          <div className="lg:pr-10">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="mt-2 h-4 w-64 max-w-full" />
            <div className="mt-6 space-y-5">
              <FieldSkeleton />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>

          <div className="border-t border-border pt-10 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="mt-2 h-4 w-72 max-w-full" />
            <div className="mt-6 space-y-5">
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
