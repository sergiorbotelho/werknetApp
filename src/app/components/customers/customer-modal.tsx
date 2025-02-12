import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { api } from "@/services/api/api";
import { Customer } from "@/types/customer";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquareX } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import { z } from "zod";

const schema = z
  .object({
    nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    telefone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido"),
    cpf: z.string().optional(),
    cnpj: z.string().optional(),
    cep: z.string().min(8, "CEP inválido"),
    endereco: z.string().min(3, "Endereço é obrigatório"),
    numero: z.string().min(1, "Número é obrigatório"),
    bairro: z.string().min(2, "Bairro é obrigatório"),
    cidade: z.string().min(2, "Cidade é obrigatória"),
    uf: z.string().length(2, "UF deve ter 2 caracteres"),
  })
  .refine((data) => data.cpf || data.cnpj, {
    message: "CPF ou CNPJ é obrigatório",
    path: ["cpf"],
  });

type FormData = z.infer<typeof schema>;

interface RegisterClientModalProps {
  onClose: VoidFunction;
  customer: Customer;
}

export function CustomerModal({ onClose, customer }: RegisterClientModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const formattedData = {
      ...data,
      telefone: data.telefone.replace(/\D/g, ""), // Remove tudo que não for número
      cpf: data.cpf.replace(/\D/g, ""),
      cnpj: data.cnpj.replace(/\D/g, ""),
      cep: data.cep.replace(/\D/g, ""),
    };
    await api
      .post("/client", formattedData)
      .then((reponse) => {
        reset();
        onClose();
        toast.success("Cliente cadastrado com sucesso.");
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCepChange = async (cep: string) => {
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setValue("endereco", data.logradouro);
          setValue("bairro", data.bairro);
          setValue("cidade", data.localidade);
          setValue("uf", data.uf);
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {customer ? "Detalhes do" : "Cadastro de"} Cliente
          </DialogTitle>
          <DialogTrigger
            asChild
            className="absolute right-2 top-1 cursor-pointer"
          >
            <SquareX size={30} />
          </DialogTrigger>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                {...register("nome")}
                className={errors.nome ? "border-red-500" : ""}
              />
              {errors.nome && (
                <p className="text-sm text-red-500">{errors.nome.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <InputMask
                mask="(99) 99999-9999"
                {...register("telefone")}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.telefone ? "border-red-500" : ""
                }`}
              />
              {errors.telefone && (
                <p className="text-sm text-red-500">
                  {errors.telefone.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cpf">CPF</Label>
                <InputMask
                  mask="999.999.999-99"
                  {...register("cpf")}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.cpf ? "border-red-500" : ""
                  }`}
                />
                {errors.cpf && (
                  <p className="text-sm text-red-500">{errors.cpf.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <InputMask
                  mask="99.999.999/9999-99"
                  {...register("cnpj")}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.cnpj ? "border-red-500" : ""
                  }`}
                />
                {errors.cnpj && (
                  <p className="text-sm text-red-500">{errors.cnpj.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cep">CEP</Label>
              <InputMask
                mask="99999-999"
                {...register("cep")}
                onChange={(e) =>
                  handleCepChange(e.target.value.replace(/\D/g, ""))
                }
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.cep ? "border-red-500" : ""
                }`}
              />
              {errors.cep && (
                <p className="text-sm text-red-500">{errors.cep.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 grid gap-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  {...register("endereco")}
                  className={errors.endereco ? "border-red-500" : ""}
                />
                {errors.endereco && (
                  <p className="text-sm text-red-500">
                    {errors.endereco.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  {...register("numero")}
                  className={errors.numero ? "border-red-500" : ""}
                />
                {errors.numero && (
                  <p className="text-sm text-red-500">
                    {errors.numero.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                {...register("bairro")}
                className={errors.bairro ? "border-red-500" : ""}
              />
              {errors.bairro && (
                <p className="text-sm text-red-500">{errors.bairro.message}</p>
              )}
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3 grid gap-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  {...register("cidade")}
                  className={errors.cidade ? "border-red-500" : ""}
                />
                {errors.cidade && (
                  <p className="text-sm text-red-500">
                    {errors.cidade.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="state">UF</Label>
                <Input
                  id="state"
                  {...register("uf")}
                  maxLength={2}
                  className={`uppercase ${errors.uf ? "border-red-500" : ""}`}
                />
                {errors.uf && (
                  <p className="text-sm text-red-500">{errors.uf.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => onClose()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
