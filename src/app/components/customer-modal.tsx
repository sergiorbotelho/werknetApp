import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { api } from "@/services/api/api";
import { Customer } from "@/types/customer";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ICustomerProps {
  customer: Customer | null;
  onClose: () => void;
  setRefresh: (valeu: boolean) => void;
}

export function CustomerModal({
  customer,
  onClose,
  setRefresh,
}: ICustomerProps) {
  const [update, setUpdate] = useState(customer ? "Atualizar" : "Salvar");

  const [formData, setFormData] = useState(
    customer
      ? {
          ...customer,
          cpf: customer.cpf ?? "",
          cnpj: customer.cnpj ?? "",
        }
      : {
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
        }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveCustomer = async (customerEdit: Customer) => {
    setRefresh(true);
    if (!customer) {
      await api
        .post("/client", customerEdit)
        .then((response) => {
          setRefresh(false);
          toast.success("Cliente cadastrado com sucesso");
          onClose();
        })
        .catch((error) => {
          console.error(error);
        });
    }
    if (customer) {
      const { id, ...data } = customerEdit;

      await api
        .put(`/client/${customerEdit.id}`, data)
        .then((response) => {
          setRefresh(false);
          toast.success("Cliente atualizado com sucesso");
          onClose();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleSubmit = (e) => {
    if (update === "Atualizar") {
      e.preventDefault();
      setUpdate("Salvar");
    } else if (update === "Salvar") {
      e.preventDefault();
      handleSaveCustomer(formData);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-w-[450px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {customer ? "Detalhes do cliente" : "Adicionar Cliente"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="text-left">
          <div className="grid gap-4 py-4 ">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                autoFocus={false}
                onChange={handleChange}
                className="col-span-3"
                readOnly={update !== "Salvar" ? true : false}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefone" className="text-right">
                Telefone
              </Label>
              <Input
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="col-span-3"
                readOnly={update !== "Salvar" ? true : false}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cpf" className="text-right">
                CPF
              </Label>
              <Input
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className="col-span-3"
                readOnly={update !== "Salvar" ? true : false}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cnpj" className="text-right">
                CNPJ
              </Label>
              <Input
                id="cnpj"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                className="col-span-3"
                readOnly={update !== "Salvar" ? true : false}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cep" className="text-right">
                CEP
              </Label>
              <Input
                id="cep"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                className="col-span-3"
                readOnly={update !== "Salvar" ? true : false}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endereco" className="text-right">
                Endereço
              </Label>
              <Input
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                className="col-span-3"
                readOnly={update !== "Salvar" ? true : false}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="numero" className="text-right">
                Número
              </Label>
              <Input
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                className="col-span-3"
                readOnly={update !== "Salvar" ? true : false}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bairro" className="text-right">
                Bairro
              </Label>
              <Input
                id="bairro"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                className="col-span-3"
                readOnly={update !== "Salvar" ? true : false}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cidade" className="text-right">
                Cidade
              </Label>
              <Input
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className="col-span-3"
                readOnly={update !== "Salvar" ? true : false}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="uf" className="text-right">
                UF
              </Label>
              <Input
                id="uf"
                name="uf"
                value={formData.uf}
                onChange={handleChange}
                className="col-span-3"
                readOnly={update !== "Salvar" ? true : false}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{update}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
