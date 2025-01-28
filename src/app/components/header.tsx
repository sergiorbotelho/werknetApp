import { Button } from "@/app/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.jpeg";
export function Header() {
  return (
    <header className=" border-b hidden md:block ">
      <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image alt="Logo WerkNet" src={logo} width={200} />
        </Link>
        <nav className="flex items-center space-x-4">
          <Button
            variant="default"
            className="bg-blue-100 text-black font-semibold hover:bg-blue-200"
            asChild
          >
            <Link href="/customers">Cliente</Link>
          </Button>
          <Button
            variant="default"
            className="bg-green-100 text-black font-semibold hover:bg-green-200"
            asChild
          >
            <Link href="/serviceorder">Ordem de Serviço</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
