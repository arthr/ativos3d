export function useCurrencyBRL(): (value: number) => string {
  const fmt = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  });
  return (value: number) => fmt.format(value);
}
