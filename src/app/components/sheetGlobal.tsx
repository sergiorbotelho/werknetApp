import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

export default function SheetMenu() {
  return (
    <div className="md:hidden text-right mt-4 mr-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent>TESTANDO</SheetContent>
      </Sheet>
    </div>
  );
}
