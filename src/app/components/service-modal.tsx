import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useEffect, useState } from "react";

import { api } from "@/services/api/api";
import { Customer } from "../../types/customer";

import { CustomerModal } from "./customers/customer-modal";
import { TimePicker } from "./timePicker";

export function ServiceOrderModalAntigo({ order, onClose, onSave }) {
  const [formData, setFormData] = useState(
    order
      ? {
          ...order,
          horaChegada: order.horaChegada.slice(0, 5),
          horaSaida: order.horaSaida.slice(0, 5),
        }
      : {
          nome: "",
          horaChegada: "",
          horaSaida: "",
          modeloEquipamento: "",
          defeito: "",
          contato: "",
          defeitoConstatado: "",
          solucao: "",
          valServico: "",
          valMaterial: "",
          garantiaPeca: "",
          garantiaServico: "",
          tipoServico: "",
        }
  );

  const [update, setUpdate] = useState(order ? "Atualizar" : "Salvar");
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const loadCustomers = async () => {
      await api
        .get("/customers")
        .then((response) => {
          setCustomers(response.data.customers);
        })
        .catch((error) => {
          console.error(error);
        });
    };
    loadCustomers();
  }, [refresh]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTipo = (e) => {
    setFormData({ ...formData, tipoServico: e });
    console.log(e);
  };

  const handleSave = (formData) => {
    onSave(formData);
    onClose();
  };

  const handleSubmit = (e) => {
    if (update === "Atualizar") {
      e.preventDefault();
      setUpdate("Salvar");
    } else if (update === "Salvar") {
      e.preventDefault();
      handleSave(formData);
    }
  };
  const handleCustomerSelect = (customerName) => {
    setFormData({ ...formData, nome: customerName });
    setOpen(false);
  };

  const onCloseModalCustomer = () => {
    setOpen(false);
  };

  return (
    <>
      {open && <CustomerModal customer={null} onClose={onCloseModalCustomer} />}
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {order
                ? "Detalhes da Ordem de serviço"
                : "Criar nova ordem de serviço"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-2 pl-12">
                <Label htmlFor="nome" className="text-right">
                  Cliente
                </Label>

                <Select
                  value={formData.client?.nome ?? formData?.nome}
                  onValueChange={(value) => handleCustomerSelect(value)}
                  disabled={!!formData.client?.nome} // Desabilita o Select se formData.nome tiver um valor
                >
                  <SelectTrigger className="flex flex-1">
                    {/* Usa o valor diretamente de formData.nome se ele existir */}
                    <SelectValue>
                      {formData.client?.nome ||
                        formData?.nome ||
                        "Selecione o cliente"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((item, index) => (
                      <SelectItem key={index} value={item.nome}>
                        {item.nome}
                      </SelectItem>
                    ))}
                    {!formData.client?.nome && ( // Exibe o botão de adicionar apenas se não houver um nome
                      <Button
                        className="w-full bg-blue-500"
                        size="sm"
                        onClick={() => setOpen(true)}
                      >
                        <span>Adicionar novo cliente</span>
                      </Button>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Hora de chegada</Label>
                <div className="col-span-3">
                  <TimePicker
                    value={formData.horaChegada}
                    update={update}
                    onChange={(value) =>
                      setFormData({ ...formData, horaChegada: value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Hora de saída</Label>
                <div className="col-span-3">
                  <TimePicker
                    value={formData.horaSaida}
                    update={update}
                    onChange={(value) =>
                      setFormData({ ...formData, horaSaida: value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contato" className="text-right">
                  Contato
                </Label>
                <Input
                  id="contato"
                  name="contato"
                  value={formData.contato}
                  onChange={handleChange}
                  className="col-span-3"
                  readOnly={update !== "Salvar" ? true : false}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="modeloEquipamento" className="text-right">
                  Modelo do Equipamento
                </Label>
                <Input
                  id="modeloEquipamento"
                  name="modeloEquipamento"
                  value={formData.modeloEquipamento}
                  onChange={handleChange}
                  className="col-span-3"
                  readOnly={update !== "Salvar" ? true : false}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 ">
                <Select
                  onValueChange={(e) => handleTipo(e)}
                  disabled={update !== "Salvar" ? true : false}
                >
                  <Label className="text-right">Tipo de serviço</Label>
                  <SelectTrigger className="col-span-3">
                    <SelectValue
                      placeholder={
                        update ? formData.tipoServico : "Selecione um tipo"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent
                    className="w-full"
                    defaultValue={formData.tipoServico}
                  >
                    <SelectItem value="FORADEGARANTIA">
                      FORA DE GARANTIA
                    </SelectItem>
                    <SelectItem value="GARANTIA">GARANTIA</SelectItem>
                    <SelectItem value="ORCAMENTO">ORÇAMENTO</SelectItem>
                    <SelectItem value="CONTRATO">CONTRATO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="defeito" className="text-right">
                  Defeito
                </Label>
                <Input
                  id="defeito"
                  name="defeito"
                  value={formData.defeito}
                  onChange={handleChange}
                  className="col-span-3"
                  readOnly={update !== "Salvar" ? true : false}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="defeitoConstatado" className="text-right">
                  Defeito constatado
                </Label>
                <Input
                  id="defeitoConstatado"
                  name="defeitoConstatado"
                  value={formData.defeitoConstatado}
                  onChange={handleChange}
                  className="col-span-3"
                  readOnly={update !== "Salvar" ? true : false}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="solucao" className="text-right">
                  Solução
                </Label>
                <Input
                  id="solucao"
                  name="solucao"
                  value={formData.solucao}
                  onChange={handleChange}
                  className="col-span-3"
                  readOnly={update !== "Salvar" ? true : false}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valServico" className="text-right">
                  Valor do serviço
                </Label>
                <Input
                  id="valServico"
                  name="valServico"
                  value={formData.valServico}
                  onChange={handleChange}
                  className="col-span-3"
                  readOnly={update !== "Salvar" ? true : false}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valMaterial" className="text-right">
                  Valor do material
                </Label>
                <Input
                  id="valMaterial"
                  name="valMaterial"
                  value={formData.valMaterial}
                  onChange={handleChange}
                  className="col-span-3"
                  readOnly={update !== "Salvar" ? true : false}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="garantiaPeca" className="text-right">
                  Garantia da Peça
                </Label>
                <Input
                  id="garantiaPeca"
                  name="garantiaPeca"
                  value={formData.garantiaPeca}
                  onChange={handleChange}
                  className="col-span-3"
                  readOnly={update !== "Salvar" ? true : false}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="garantiaServico" className="text-right">
                  Garantia do serviço
                </Label>
                <Input
                  id="garantiaServico"
                  name="garantiaServico"
                  value={formData.garantiaServico}
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
    </>
  );
}
