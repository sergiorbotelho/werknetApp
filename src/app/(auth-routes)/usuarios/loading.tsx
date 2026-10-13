import {
  PageHeaderSkeleton,
  SearchInputSkeleton,
} from "@/app/components/page-header-skeleton";
import { Skeleton } from "@/app/components/ui/skeleton";
import { UserListSkeleton } from "@/app/components/users/user-list-skeleton";

// Mesmos contêineres de usuarios/page.tsx e users.tsx
export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mx-auto mt-4 w-full max-w-6xl space-y-6 px-4 py-4 sm:px-6 md:mt-0 md:px-8 lg:px-10 lg:py-8">
        <PageHeaderSkeleton />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInputSkeleton />
          {/* Filtro de situação */}
          <Skeleton className="h-11 w-full sm:w-60" />
        </div>
        <UserListSkeleton />
      </div>
    </div>
  );
}
