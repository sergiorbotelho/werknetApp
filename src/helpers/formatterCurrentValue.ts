export const formatCurrency = (value: string) => {
  const numericValue = value.replace(/\D/g, "");

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(numericValue) / 100);
};

export const currencyToNumber = (value: string) => {
  return Number(
    value.replace("R$", "").replace(/\./g, "").replace(",", ".").trim(),
  );
};
