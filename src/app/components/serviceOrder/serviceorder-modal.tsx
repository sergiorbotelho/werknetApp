import {
  fieldClassName,
  FormModal,
  FormModalActions,
  FormSection,
} from "@/app/components/form-modal";
import { Button } from "@/app/components/ui/button";
import { Dialog } from "@/app/components/ui/dialog";
import { formatBRL } from "@/helpers/format";
import {
  currencyToNumber,
  formatCurrency,
} from "@/helpers/formatterCurrentValue";
import { cn } from "@/lib/utils";
import { api } from "@/services/api/api";
import { Customer } from "@/types/customer";
import { IOrderService, serviceTypeLabels } from "@/types/order";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { OrderPdfModal } from "./order-pdf-modal";

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

const inputHeight = "h-11";

function RequiredMark() {
  return (
    <span className="text-red-500" aria-hidden>
      {" "}
      *
    </span>
  );
}

function moneyToNumber(value: string) {
  return value ? currencyToNumber(value) || 0 : 0;
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
  const { data: session } = useSession();
  // Excluir é só para admin (a API também recusa com 403)
  const canDelete = isEditing && session?.user.role === "ADMIN";
  // OS aberta sem edição: só leitura
  const readOnly = !!order && !isEditing;
  const [showPdf, setShowPdf] = useState(false);
  const route = useRouter();
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: order?.client?.id ? order.client.id.toString() : "",
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

  // Total ao vivo: o mesmo cálculo que a API faz ao salvar
  const total =
    moneyToNumber(form.watch("valServico")) +
    moneyToNumber(form.watch("valMaterial"));

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

  const title = order ? `OS #${order.id}` : "Nova ordem de serviço";
  const description = order
    ? order.client?.nome
    : "Preencha os dados do atendimento.";

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <FormModal
        size="lg"
        title={title}
        description={description}
        onClose={onClose}
        headerAction={
          order && (
            <Button
              type="button"
              variant="outline"
              className="h-10 shrink-0 gap-1.5"
              onClick={() => setShowPdf(true)}
            >
              <FileText className="h-4 w-4" />
              PDF
            </Button>
          )
        }
        footer={
          <FormModalActions
            danger={
              canDelete && (
                <Button
                  type="button"
                  variant="ghost"
                  className="h-11 w-full text-red-600 hover:bg-red-50 hover:text-red-700 sm:w-auto"
                  onClick={() => setOpenAlertDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir OS
                </Button>
              )
            }
          >
            <Button
              type="button"
              variant="outline"
              className="h-11"
              onClick={onClose}
            >
              {readOnly ? "Fechar" : "Cancelar"}
            </Button>
            {!readOnly && (
              <Button
                type="submit"
                form="os-form"
                className="h-11"
                disabled={loading}
              >
                {loading
                  ? "Salvando..."
                  : order
                    ? "Salvar alterações"
                    : "Cadastrar OS"}
              </Button>
            )}
          </FormModalActions>
        }
      >
        <Form {...form}>
          <form id="os-form" onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={readOnly} className="min-w-0 space-y-5">
              <FormSection title="Atendimento">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 sm:col-span-6">
                      <FormLabel>
                        Cliente
                        <RequiredMark />
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        disabled={!!order}
                      >
                        <FormControl>
                          <SelectTrigger className={inputHeight}>
                            <SelectValue placeholder="Selecione um cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.length > 0 ? (
                            customers.map((client) => (
                              <SelectItem
                                key={client.id}
                                value={client.id.toString()}
                              >
                                {client.nome}
                              </SelectItem>
                            ))
                          ) : order?.client ? (
                            // Enquanto a lista carrega, mantém o cliente da OS visível
                            <SelectItem value={order.client.id.toString()}>
                              {order.client.nome}
                            </SelectItem>
                          ) : (
                            <div className="p-2">
                              <p className="mb-2 text-sm text-muted-foreground">
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
                      {order && (
                        <p className="text-xs text-muted-foreground">
                          O cliente não pode ser trocado depois do cadastro.
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contato"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 sm:col-span-3">
                      <FormLabel>
                        Contato
                        <RequiredMark />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Quem atendeu no local"
                          className={inputHeight}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tipoServico"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 sm:col-span-3">
                      <FormLabel>
                        Tipo de serviço
                        <RequiredMark />
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                        disabled={readOnly}
                      >
                        <FormControl>
                          <SelectTrigger className={inputHeight}>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(serviceTypeLabels).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="horaChegada"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 sm:col-span-3">
                      <FormLabel>
                        Hora de chegada
                        <RequiredMark />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          className={inputHeight}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="horaSaida"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 sm:col-span-3">
                      <FormLabel>Hora de saída</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          className={inputHeight}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>

              <FormSection title="Equipamento">
                <FormField
                  control={form.control}
                  name="modeloEquipamento"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 sm:col-span-6">
                      <FormLabel>
                        Modelo do equipamento
                        <RequiredMark />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex.: Impressora Epson L3250"
                          className={inputHeight}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defeito"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 sm:col-span-3">
                      <FormLabel>
                        Defeito relatado
                        <RequiredMark />
                      </FormLabel>
                      <FormControl>
                        <textarea
                          rows={3}
                          placeholder="O que o cliente informou"
                          className={cn(fieldClassName, "min-h-24 resize-y")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defeitoConstatado"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 sm:col-span-3">
                      <FormLabel>Defeito constatado</FormLabel>
                      <FormControl>
                        <textarea
                          rows={3}
                          placeholder="O que o técnico encontrou"
                          className={cn(fieldClassName, "min-h-24 resize-y")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="solucao"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 sm:col-span-6">
                      <FormLabel>Solução</FormLabel>
                      <FormControl>
                        <textarea
                          rows={3}
                          placeholder="O que foi feito para resolver"
                          className={cn(fieldClassName, "min-h-24 resize-y")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>

              <FormSection title="Valores">
                <FormField
                  control={form.control}
                  name="valServico"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 sm:col-span-2">
                      <FormLabel>Serviço</FormLabel>
                      <FormControl>
                        <Input
                          inputMode="numeric"
                          placeholder="R$ 0,00"
                          className={cn(inputHeight, "tabular-nums")}
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
                    <FormItem className="space-y-1.5 sm:col-span-2">
                      <FormLabel>Material</FormLabel>
                      <FormControl>
                        <Input
                          inputMode="numeric"
                          placeholder="R$ 0,00"
                          className={cn(inputHeight, "tabular-nums")}
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
                {/* Mesma estrutura dos campos ao lado (rótulo + caixa h-11),
                    para alinhar sem margem fixa */}
                <div className="space-y-1.5 sm:col-span-2">
                  <Label id="total-label">Total</Label>
                  <output
                    aria-labelledby="total-label"
                    aria-live="polite"
                    className={cn(
                      inputHeight,
                      "flex items-center justify-end rounded-md bg-primary px-4 text-lg font-bold tabular-nums text-primary-foreground",
                    )}
                  >
                    {formatBRL(total)}
                  </output>
                </div>
              </FormSection>

              <FormSection title="Garantia">
                <FormField
                  control={form.control}
                  name="garantiaPeca"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 sm:col-span-3">
                      <FormLabel>Garantia da peça</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex.: 90 dias"
                          className={inputHeight}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="garantiaServico"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 sm:col-span-3">
                      <FormLabel>Garantia do serviço</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex.: 30 dias"
                          className={inputHeight}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>
            </fieldset>
          </form>
        </Form>
      </FormModal>
      <ConfirmationDialog
        title="Excluir ordem de serviço?"
        description={`Tem certeza de que deseja excluir a ordem de serviço ${
          order?.id ?? ""
        }?`}
        loading={loading}
        openAlertDialog={openAlertDialog}
        setOpenAlertDialog={setOpenAlertDialog}
        handleExcluir={handleExcluir}
      />
      {showPdf && order && (
        <OrderPdfModal order={order} onClose={() => setShowPdf(false)} />
      )}
    </Dialog>
  );
}
