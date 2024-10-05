// components/CustomerCardSkeleton.tsx
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export function CustomerCardSkeleton() {
  return (
    <Card className="relative animate-pulse">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-4 bg-gray-300 rounded w-36 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </CardContent>
    </Card>
  );
}
