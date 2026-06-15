import { Card } from "../ui/card";

export const CardCustomerSkeleton = () => {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <div className="flex gap-3 flex-1">
          <div className="h-12 w-12 rounded-xl bg-muted animate-pulse shrink-0" />

          <div className="flex-1 space-y-2">
            <div className="h-5 w-32 rounded bg-muted animate-pulse" />
            <div className="h-3 w-24 rounded bg-muted animate-pulse" />
          </div>
        </div>

        <div className="h-8 w-20 rounded-md bg-muted animate-pulse" />
      </div>

      <div className="mt-4 space-y-3">
        <div className="h-4 w-40 rounded bg-muted animate-pulse" />
        <div className="h-4 w-52 rounded bg-muted animate-pulse" />
        <div className="h-4 w-full rounded bg-muted animate-pulse" />
      </div>

      <div className="mt-4 h-4 w-36 rounded bg-muted animate-pulse" />
    </Card>
  );
};
