import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { Logs, Menu, UserPenIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.jpeg";
import { Button } from "./ui/button";
export default function SheetMenu() {
  return (
    <div className=" mt-4 ml-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <Menu />
          </Button>
        </SheetTrigger>

        <SheetContent side="left">
          <SheetClose asChild>
            <Link className="-mt-4" href={"/"}>
              <Image alt="Logo WerkNet" src={logo} width={200} />
            </Link>
          </SheetClose>
          <div className="flex flex-col gap-4 mt-6">
            <SheetClose asChild>
              <Link
                className="flex gap-4 items-center hover:bg-gray-200 p-4 rounded-lg cursor-pointer"
                href={"/customers"}
              >
                <div>
                  <UserPenIcon />
                </div>
                <div>Clientes</div>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                className="flex gap-4 items-center hover:bg-gray-200 p-4 rounded-lg cursor-pointer"
                href={"/serviceorder"}
              >
                <div>
                  <Logs />
                </div>
                <div>Ordens de serviço</div>
              </Link>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
