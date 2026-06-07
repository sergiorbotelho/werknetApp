import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  currencyToNumber,
  formatCurrency,
} from "@/helpers/formatterCurrentValue";
import PdfOrder from "@/report/pdfOrder";
import { api } from "@/services/api/api";
import { Customer } from "@/types/customer";
import { IOrderService } from "@/types/order";
import { zodResolver } from "@hookform/resolvers/zod";
import { Printer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { ConfirmationDialog } from "../confirmation-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const schema = z.object({
  nome: z
    .string({
      required_error: "Por favor, selecione um cliente.",
    })
    .min(1, "Por favor, selecione um cliente."),
  horaChegada: z.string().min(1, "Hora de chegada é obrigatória"),
  horaSaida: z.string(),
  modeloEquipamento: z.string().min(1, "Modelo do equipamento é obrigatório"),
  defeito: z.string().min(1, "Defeito é obrigatório"),
  contato: z.string().min(1, "Contato é obrigatório"),
  defeitoConstatado: z.string(),
  solucao: z.string(),
  valServico: z.string(),
  valMaterial: z.string(),
  garantiaPeca: z.string(),
  garantiaServico: z.string(),
  tipoServico: z
    .string({
      required_error: "Por favor, selecione o tipo de serviço.",
    })
    .min(1, "Por favor, selecione o tipo de serviço."),
});

type ServiceFormValues = z.infer<typeof schema>;

interface RegisterClientModalProps {
  onClose: VoidFunction;
  order: IOrderService;
  isEditing?: boolean;
  loadOrders: () => Promise<void>;
}

export function ServiceOrderModal({
  onClose,
  order,
  isEditing,
  loadOrders,
}: RegisterClientModalProps) {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const route = useRouter();
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: order ? order.client.id.toString() : "",
      horaChegada: order ? order.horaChegada : "",
      horaSaida: order ? order.horaSaida : "",
      modeloEquipamento: order ? order.modeloEquipamento : "",
      defeito: order ? order.defeito : "",
      contato: order ? order.contato : "",
      defeitoConstatado: order ? order.defeitoConstatado : "",
      solucao: order ? order.solucao : "",
      valServico: order
        ? Number(order.valServico).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })
        : "",
      valMaterial: order
        ? Number(order.valMaterial).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })
        : "",
      garantiaPeca: order ? order.garantiaPeca : "",
      garantiaServico: order ? order.garantiaServico : "",
      tipoServico: order ? order.tipoServico : "",
    },
  });

  useEffect(() => {
    loadCustomers();
  }, []);
  const onSubmit = async () => {
    const formData = form.getValues();

    const data = {
      cliente_id: Number(formData.nome),
      contato: formData.contato,
      modeloEquipamento: formData.modeloEquipamento,
      tipoServico: formData.tipoServico,
      defeito: formData.defeito,
      defeitoConstatado: formData.defeitoConstatado,
      solucao: formData.solucao,
      valServico:
        formData.valServico !== "" ? currencyToNumber(formData.valServico) : 0,
      valMaterial:
        formData.valMaterial !== ""
          ? currencyToNumber(formData.valMaterial)
          : 0,
      garantiaPeca: formData.garantiaPeca,
      garantiaServico: formData.garantiaServico,
      horaChegada: formData.horaChegada,
      horaSaida: formData.horaSaida,
    };

    const dataIsEditing = {
      id: order?.id,
      ...data,
    };

    setLoading(true);

    if (isEditing) {
      await api
        .put(`os/${order?.id}`, dataIsEditing)
        .then(() => {
          onClose();
          loadOrders();
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
        .post("os", data)
        .then(() => {
          onClose();
          loadOrders();
          toast.success("Cadastro realizado com sucesso.");
        })
        .catch((error) => {
          toast.error("Erro ao cadastrar ordem de serviço. Tente novamente.");
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const loadCustomers = async () => {
    await api
      .get("customers")
      .then((response) => {
        setCustomers(response.data.customers);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handlePrint = (e: React.MouseEvent, order: IOrderService) => {
    e.stopPropagation();

    PdfOrder({ order });
  };

  const handleExcluir = async () => {
    if (!isEditing) return onClose();
    setLoading(true);
    await api
      .delete(`/os/${order?.id}`)
      .then(() => {
        loadOrders();
        setOpenAlertDialog(false);
        onClose();
        toast.success("Ordem de serviço excluido com sucesso.");
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px] h-[80%] overflow-auto md:h-fit w-[95%] md:w-fit">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center justify-between">
            {order && !isEditing ? "Detalhes da" : "Cadastro da"} Ordem de
            serviço
            {order && !isEditing && (
              <Button
                onClick={(e) => handlePrint(e, order)}
                variant="outline"
                className="print-button"
              >
                <Printer />
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Cliente<span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    disabled={!!order}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loading ? (
                        <SelectItem value="loading">Carregando...</SelectItem>
                      ) : customers.length > 0 ? (
                        customers.map((client) => (
                          <SelectItem
                            key={client.id}
                            value={client.id.toString()}
                          >
                            {client.nome}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2">
                          <p className="text-sm text-gray-500 mb-2">
                            Nenhum cliente encontrado
                          </p>
                          <Button
                            type="button"
                            onClick={() => route.push("/customers")}
                            className="w-full"
                          >
                            Cadastrar novo cliente
                          </Button>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="contato"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Contato<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do contato" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="horaChegada"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Hora chegada<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="horaSaida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora Saída</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="modeloEquipamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Modelo equipamento<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Modelo do equipamento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipoServico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tipo do serviço<span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FORADEGARANTIA">
                          FORA DE GARANTIA
                        </SelectItem>
                        <SelectItem value="GARANTIA">GARANTIA</SelectItem>
                        <SelectItem value="ORCAMENTO">ORÇAMENTO</SelectItem>
                        <SelectItem value="CONTRATO">CONTRATO</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="defeito"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Defeito<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Descrição do defeito" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defeitoConstatado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Defeito constatado</FormLabel>
                    <FormControl>
                      <Input placeholder="Defeito constatado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="solucao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solução</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição da solução" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="valServico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do serviço</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="R$ 0,00"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(formatCurrency(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valMaterial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do material</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="R$ 0,00"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(formatCurrency(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="garantiaPeca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garantia da peça</FormLabel>
                    <FormControl>
                      <Input placeholder="Período de garantia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="garantiaServico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garantia do serviço</FormLabel>
                    <FormControl>
                      <Input placeholder="Período de garantia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant={`${order && !isEditing ? "default" : "destructive"}`}
                onClick={isEditing ? () => setOpenAlertDialog(true) : onClose}
              >
                {isEditing ? "Excluir" : "Fechar"}
              </Button>
              {(!order || isEditing) && (
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
      <ConfirmationDialog
        title="Excluir ordem de serviço?"
        description={`Tem certeza de que deseja excluir a ordem de serviço 
              ${order?.id}? `}
        loading={loading}
        openAlertDialog={openAlertDialog}
        setOpenAlertDialog={setOpenAlertDialog}
        handleExcluir={handleExcluir}
      />
    </Dialog>
  );
}
