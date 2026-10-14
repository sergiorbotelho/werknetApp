import {
  fieldClassName,
  FormModal,
  FormModalActions,
  FormSection,
} from "@/app/components/form-modal";
import { Button } from "@/app/components/ui/button";
import { Dialog } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { cn } from "@/lib/utils";
import { api } from "@/services/api/api";
import { Customer } from "@/types/customer";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { toast } from "@/lib/toast";
import { z } from "zod";
import { ConfirmationDialog } from "../confirmation-modal";

const schema = z
  .object({
    nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("Digite um e-mail válido"),
    telefone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido"),
    cpf: z.string().optional(),
    cnpj: z.string().optional(),
    cep: z.string().optional(),
    endereco: z.string().optional(),
    numero: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    uf: z.string().max(2).optional(),
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
}

interface FieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("grid content-start gap-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="text-red-500" aria-hidden>
            {" "}
            *
          </span>
        )}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

const inputHeight = "h-11";

export function CustomerModal({
  onClose,
  customer,
  isEditing,
}: RegisterClientModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const { data: session } = useSession();
  // Excluir é só para admin (a API também recusa com 403)
  const canDelete = isEditing && session?.user.role === "ADMIN";
  // Cliente aberto sem edição: só leitura
  const readOnly = !!customer && !isEditing;
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
      email: "",
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
        if (key === "telefone" && value) {
          const phone = String(value).replace(/\D/g, "");

          setValue(
            "telefone",
            phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3"),
            { shouldValidate: true },
          );

          return;
        }

        setValue(key as any, value || "", {
          shouldValidate: true,
        });
      });
    }
  }, [customer, setValue]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const formattedData = {
      ...data,
      telefone: data.telefone.replace(/\D/g, ""), // Remove tudo que não for número
      cpf: data.cpf.replace(/\D/g, ""),
      cnpj: data.cnpj.replace(/\D/g, ""),
      cep: data.cep.replace(/\D/g, ""),
    };
    if (isEditing) {
      await api
        .put(`/customer/${customer?.id}`, formattedData)
        .then(() => {
          router.refresh();
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
        .post("/customer", formattedData)
        .then(() => {
          router.refresh();
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

  const handleExcluir = async () => {
    if (!isEditing) return onClose();
    setLoading(true);
    await api
      .delete(`/customer/${customer?.id}`)
      .then(() => {
        router.refresh();
        setOpenAlertDialog(false);
        reset();
        onClose();
        toast.success("Cliente excluido com sucesso.");
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data.message);
      })
      .finally(() => setLoading(false));
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

  const cepField = register("cep");

  const title = !customer
    ? "Novo cliente"
    : readOnly
      ? "Detalhes do cliente"
      : "Editar cliente";

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <FormModal
        title={title}
        description={customer?.nome}
        onClose={onClose}
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
                  Excluir cliente
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
                form="customer-form"
                className="h-11"
                disabled={loading}
              >
                {loading
                  ? "Salvando..."
                  : customer
                    ? "Salvar alterações"
                    : "Cadastrar cliente"}
              </Button>
            )}
          </FormModalActions>
        }
      >
        <form
          id="customer-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <FormSection title="Identificação">
            <Field
              label="Nome"
              htmlFor="nome"
              required
              error={errors.nome?.message}
              className="sm:col-span-6"
            >
              <Input
                id="nome"
                {...register("nome")}
                autoComplete="off"
                disabled={readOnly}
                aria-invalid={!!errors.nome}
                className={cn(inputHeight, errors.nome && "border-red-500")}
              />
            </Field>
            <Field
              label="CPF"
              htmlFor="cpf"
              error={errors.cpf?.message}
              hint="Informe o CPF ou o CNPJ."
              className="sm:col-span-3"
            >
              <InputMask
                id="cpf"
                mask="999.999.999-99"
                inputMode="numeric"
                {...register("cpf")}
                disabled={readOnly}
                aria-invalid={!!errors.cpf}
                className={cn(
                  fieldClassName,
                  inputHeight,
                  errors.cpf && "border-red-500",
                )}
              />
            </Field>
            <Field
              label="CNPJ"
              htmlFor="cnpj"
              error={errors.cnpj?.message}
              className="sm:col-span-3"
            >
              <InputMask
                id="cnpj"
                mask="99.999.999/9999-99"
                inputMode="numeric"
                {...register("cnpj")}
                disabled={readOnly}
                aria-invalid={!!errors.cnpj}
                className={cn(
                  fieldClassName,
                  inputHeight,
                  errors.cnpj && "border-red-500",
                )}
              />
            </Field>
          </FormSection>

          <FormSection title="Contato">
            <Field
              label="Telefone"
              htmlFor="telefone"
              required
              error={errors.telefone?.message}
              className="sm:col-span-3"
            >
              <InputMask
                id="telefone"
                mask="(99) 99999-9999"
                inputMode="tel"
                {...register("telefone")}
                value={watch("telefone") || ""}
                disabled={readOnly}
                aria-invalid={!!errors.telefone}
                className={cn(
                  fieldClassName,
                  inputHeight,
                  errors.telefone && "border-red-500",
                )}
              />
            </Field>
            <Field
              label="E-mail"
              htmlFor="email"
              required
              error={errors.email?.message}
              className="sm:col-span-3"
            >
              <Input
                id="email"
                type="email"
                inputMode="email"
                {...register("email")}
                disabled={readOnly}
                aria-invalid={!!errors.email}
                className={cn(inputHeight, errors.email && "border-red-500")}
              />
            </Field>
          </FormSection>

          <FormSection
            title="Endereço"
            description="Digite o CEP para preencher o endereço automaticamente."
          >
            <Field
              label="CEP"
              htmlFor="cep"
              error={errors.cep?.message}
              className="sm:col-span-2"
            >
              <InputMask
                id="cep"
                mask="99999-999"
                inputMode="numeric"
                {...cepField}
                onChange={(e) => {
                  cepField.onChange(e);
                  handleCepChange(e.target.value.replace(/\D/g, ""));
                }}
                disabled={readOnly}
                className={cn(
                  fieldClassName,
                  inputHeight,
                  errors.cep && "border-red-500",
                )}
              />
            </Field>
            <Field
              label="Endereço"
              htmlFor="endereco"
              error={errors.endereco?.message}
              className="sm:col-span-4"
            >
              <Input
                id="endereco"
                {...register("endereco")}
                disabled={readOnly}
                className={inputHeight}
              />
            </Field>
            <Field
              label="Número"
              htmlFor="numero"
              error={errors.numero?.message}
              className="sm:col-span-2"
            >
              <Input
                id="numero"
                {...register("numero")}
                disabled={readOnly}
                className={inputHeight}
              />
            </Field>
            <Field
              label="Bairro"
              htmlFor="bairro"
              error={errors.bairro?.message}
              className="sm:col-span-4"
            >
              <Input
                id="bairro"
                {...register("bairro")}
                disabled={readOnly}
                className={inputHeight}
              />
            </Field>
            <Field
              label="Cidade"
              htmlFor="cidade"
              error={errors.cidade?.message}
              className="sm:col-span-4"
            >
              <Input
                id="cidade"
                {...register("cidade")}
                disabled={readOnly}
                className={inputHeight}
              />
            </Field>
            <Field
              label="UF"
              htmlFor="uf"
              error={errors.uf?.message}
              className="sm:col-span-2"
            >
              <Input
                id="uf"
                {...register("uf")}
                maxLength={2}
                disabled={readOnly}
                className={cn(inputHeight, "uppercase")}
              />
            </Field>
          </FormSection>
        </form>
      </FormModal>
      <ConfirmationDialog
        title="Excluir cliente?"
        description={`Tem certeza de que deseja excluir o cliente ${
          customer?.nome?.toUpperCase() ?? ""
        }?`}
        loading={loading}
        openAlertDialog={openAlertDialog}
        setOpenAlertDialog={setOpenAlertDialog}
        handleExcluir={handleExcluir}
      />
    </Dialog>
  );
}
