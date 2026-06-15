import { Card } from "../ui/card";

export const CardSkeleton = () => {
  return (
    <Card className="p-5 bg-card-gradient animate-pulse space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 w-full">
          <div className="h-12 w-12 rounded-xl bg-muted shrink-0" />

          <div className="space-y-2 w-full">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/4" />
          </div>
        </div>

        <div className="h-8 w-8 bg-muted rounded shrink-0" />
      </div>

      <div className="space-y-2.5 pt-2">
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-2/3" />
        <div className="h-8 bg-muted rounded w-full" />
      </div>

      <div className="pt-3 border-t flex items-center justify-between">
        <div className="h-3 bg-muted rounded w-12" />
        <div className="h-4 bg-muted rounded w-16" />
      </div>
    </Card>
  );
};
