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
import { useEffect, useState } from "react";
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
    uf: z.string().length(2, "UF é obrigatória"),
  })
  .refine((data) => data.cpf || data.cnpj, {
    message: "CPF ou CNPJ é obrigatório",
    path: ["cpf"],
  });

type FormData = z.infer<typeof schema>;

interface RegisterClientModalProps {
  onClose: VoidFunction;
  customer: Customer;
  isEditing?: boolean;
  setLoading?: VoidFunction;
}

export function CustomerModal({
  onClose,
  customer,
  isEditing,
}: RegisterClientModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      telefone: "",
      cpf: "",
      cnpj: "",
      cep: "",
      endereco: "",
      numero: "",
      bairro: "",
      cidade: "",
      uf: "",
    },
  });

  useEffect(() => {
    if (customer) {
      const { id, ...rest } = customer;
      Object.entries(rest).forEach(([key, value]) => {
        setValue(key as any, value || "");
      });
    }
  }, []);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const formattedData = {
      ...data,
      telefone: data.telefone.replace(/\D/g, ""), // Remove tudo que não for número
      cpf: data.cpf.replace(/\D/g, ""),
      cnpj: data.cnpj.replace(/\D/g, ""),
      cep: data.cep.replace(/\D/g, ""),
    };
    console.log(formattedData);
    if (isEditing) {
      await api
        .put(`/client/${customer?.id}`, formattedData)
        .then((reponse) => {
          reset();
          onClose();
          toast.success("Cadastro alterado com sucesso.");
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      await api
        .post("/client", formattedData)
        .then((reponse) => {
          reset();
          onClose();
          toast.success("Cadastro realizado com sucesso.");
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
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
            {customer && !isEditing ? "Detalhes do" : "Cadastro de"} Cliente
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
            <div className="grid gap-1">
              <Label htmlFor="name">
                Nome<span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register("nome")}
                className={errors.nome ? "border-red-500" : ""}
                disabled={customer && !isEditing ? true : false}
              />
              {errors.nome && (
                <p className="text-xs text-red-500">{errors.nome.message}</p>
              )}
            </div>

            <div className="grid gap-1">
              <Label htmlFor="phone">
                Telefone<span className="text-red-500">*</span>
              </Label>
              <InputMask
                mask="(99) 99999-9999"
                {...register("telefone")}
                value={watch("telefone") || ""}
                disabled={customer && !isEditing ? true : false}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.telefone ? "border-red-500" : ""
                }`}
              />
              {errors.telefone && (
                <p className="text-xs text-red-500">
                  {errors.telefone.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label htmlFor="cpf">
                  CPF<span className="text-red-500">*</span>
                </Label>
                <InputMask
                  mask="999.999.999-99"
                  {...register("cpf")}
                  disabled={customer ? true : false}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.cpf ? "border-red-500" : ""
                  }`}
                />
                {errors.cpf && (
                  <p className="text-xs text-red-500">{errors.cpf.message}</p>
                )}
              </div>

              <div className="grid gap-1">
                <Label htmlFor="cnpj">
                  CNPJ<span className="text-red-500">*</span>
                </Label>
                <InputMask
                  mask="99.999.999/9999-99"
                  disabled={customer ? true : false}
                  {...register("cnpj")}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.cnpj ? "border-red-500" : ""
                  }`}
                />
                {errors.cnpj && (
                  <p className="text-xs text-red-500">{errors.cnpj.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-1">
              <Label htmlFor="cep">
                CEP<span className="text-red-500">*</span>
              </Label>
              <InputMask
                disabled={customer && !isEditing ? true : false}
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
                <p className="text-xs text-red-500">{errors.cep.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 grid gap-1">
                <Label htmlFor="address">
                  Endereço<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  disabled
                  {...register("endereco")}
                  className={errors.endereco ? "border-red-500" : ""}
                />
                {errors.endereco && (
                  <p className="text-xs text-red-500">
                    {errors.endereco.message}
                  </p>
                )}
              </div>

              <div className="grid gap-1">
                <Label htmlFor="number">
                  Número<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="number"
                  disabled={customer && !isEditing ? true : false}
                  {...register("numero")}
                  className={errors.numero ? "border-red-500" : ""}
                />
                {errors.numero && (
                  <p className="text-xs text-red-500">
                    {errors.numero.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-1">
              <Label htmlFor="neighborhood">
                Bairro<span className="text-red-500">*</span>
              </Label>
              <Input
                disabled
                id="neighborhood"
                {...register("bairro")}
                className={errors.bairro ? "border-red-500" : ""}
              />
              {errors.bairro && (
                <p className="text-xs text-red-500">{errors.bairro.message}</p>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-3 grid gap-1">
                <Label htmlFor="city">
                  Cidade<span className="text-red-500">*</span>
                </Label>
                <Input
                  disabled
                  id="city"
                  {...register("cidade")}
                  className={errors.cidade ? "border-red-500" : ""}
                />
                {errors.cidade && (
                  <p className="text-xs text-red-500">
                    {errors.cidade.message}
                  </p>
                )}
              </div>

              <div className="grid gap-1">
                <Label htmlFor="state">
                  UF<span className="text-red-500">*</span>
                </Label>
                <Input
                  disabled
                  id="state"
                  {...register("uf")}
                  maxLength={2}
                  className={`uppercase ${errors.uf ? "border-red-500" : ""}`}
                />
                {errors.uf && (
                  <p className="text-xs text-red-500">{errors.uf.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant={`${customer && !isEditing ? "default" : "outline"}`}
              onClick={() => onClose()}
            >
              {customer && !isEditing ? "Fechar" : "Cancelar"}
            </Button>
            {(!customer || isEditing) && (
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
