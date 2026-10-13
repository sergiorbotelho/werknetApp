import { Skeleton } from "@/app/components/ui/skeleton";

// Mesmos contêineres de backup/page.tsx e backup.tsx
export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mx-auto mt-4 w-full max-w-6xl space-y-6 px-4 py-4 sm:px-6 md:mt-0 md:px-8 lg:px-10 lg:py-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 sm:h-9 md:h-10" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
