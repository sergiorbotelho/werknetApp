import { CustomerListSkeleton } from "@/app/components/customers/customer-list-skeleton";
import {
  PageHeaderSkeleton,
  SearchInputSkeleton,
} from "@/app/components/page-header-skeleton";

// Mesmos contêineres de customers/page.tsx e cutomers.tsx
export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mx-auto mt-4 w-full max-w-7xl space-y-6 px-4 py-4 sm:px-6 md:mt-0 md:px-8 lg:px-10 lg:py-8">
        <PageHeaderSkeleton />
        <SearchInputSkeleton />
        <CustomerListSkeleton />
      </div>
    </div>
  );
}
