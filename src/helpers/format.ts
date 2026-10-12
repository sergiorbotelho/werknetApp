// Fuso fixo: o mesmo texto no servidor e no navegador (evita erro de hidratação)
const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "America/Recife",
});

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatDate(value: string | Date) {
  return dateFormatter.format(new Date(value));
}

export function formatBRL(value: number) {
  return currencyFormatter.format(value);
}

// "81999998888" → "(81) 99999-8888"; formatos desconhecidos voltam como vieram
export function formatPhone(value?: string) {
  const digits = (value ?? "").replace(/\D/g, "");
  if (digits.length === 11) {
    return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  }
  if (digits.length === 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  }
  return value ?? "";
}

// CPF "12345678909" → "123.456.789-09"; CNPJ com 14 dígitos → "12.345.678/0001-90"
export function formatDocument(cpf?: string, cnpj?: string) {
  const cpfDigits = (cpf ?? "").replace(/\D/g, "");
  if (cpfDigits.length === 11) {
    return cpfDigits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }
  const cnpjDigits = (cnpj ?? "").replace(/\D/g, "");
  if (cnpjDigits.length === 14) {
    return cnpjDigits.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5",
    );
  }
  return "";
}
