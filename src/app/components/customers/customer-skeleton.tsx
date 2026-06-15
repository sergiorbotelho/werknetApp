import { Card } from "../ui/card";
import { CardCustomerSkeleton } from "./customer-card-skeleton";

export function CustomersSkeleton() {
  return (
    <div className="w-full px-4 py-4 sm:px-6 md:px-8 lg:px-10 space-y-4 md:space-y-8 max-w-7xl mx-auto mt-4 md:mt-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-10 w-48 rounded-md bg-gray-200 animate-pulse" />
          <div className="h-4 w-72 rounded-md bg-gray-200 animate-pulse" />
        </div>

        <div className="h-11 w-full sm:w-40 rounded-md bg-gray-200 animate-pulse" />
      </div>

      <Card className="p-4">
        <div className="h-12 w-full rounded-md bg-muted animate-pulse" />
      </Card>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx}>
            <CardCustomerSkeleton />
          </div>
        ))}
      </section>
    </div>
  );
}
