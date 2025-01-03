import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.jpeg";

export default function Home() {
  return (
    <>
      <div className="w-full h-screen flex flex-col px-8 items-center md:mt-20">
        <Image
          alt="Logo da WerkNet"
          src={logo}
          width={400}
          className="md:hidden"
        />
        <h1 className="text-3xl font-bold mb-6 text-center ">
          Bem-vindo ao Gerenciamento de Ordem de Serviços da WerkNet
        </h1>
        <p className="text-xl mb-4 px-4 text-center">
          Gerencie seus clientes e ordens de serviço com eficiência.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-2 ">
          <Link
            href={"/customers"}
            className="bg-blue-100 p-6 rounded-lg cursor-pointer hover:opacity-80"
          >
            <h2 className="text-2xl font-semibold mb-2">Clientes</h2>
            <p>Visualize e gerencie seus clientes.</p>
          </Link>
          <Link
            href={"/serviceorder"}
            className="bg-green-100 p-6 rounded-lg cursor-pointer hover:opacity-80"
          >
            <h2 className="text-2xl font-semibold mb-2">Ordem de Serviços</h2>
            <p>Crie e acompanhe ordens de serviço para seus clientes.</p>
          </Link>
        </div>
      </div>
    </>
  );
}
