import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";

export function CustomerCard({ customer, onView }) {
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="cursor-pointer" onClick={onView}>
            {customer.nome}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="cursor-pointer" onClick={onView}>
        <p>Telefone: {customer.telefone}</p>
      </CardContent>
    </Card>
  );
}
