import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";

export function ServiceOrderSkeleton() {
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <Skeleton className="h-6 w-24" />
          <div className="space-x-2">
            <Skeleton className="h-8 w-8 rounded-md inline-block" />
            <Skeleton className="h-8 w-8 rounded-md inline-block" />
            <Skeleton className="h-8 w-8 rounded-md inline-block" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}
