import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Printer } from "lucide-react";

export function ServiceOrderCard({ order, onView, onPrint }) {
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="cursor-pointer" onClick={onView}>
            OS {order.id}
          </span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onPrint();
              }}
            >
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="cursor-pointer" onClick={onView}>
        <p>Cliente: {order.client.nome}</p>
        <p>Equipamento: {order.modeloEquipamento}</p>
        <p>Defeito: {order.defeito}</p>
      </CardContent>
    </Card>
  );
}
