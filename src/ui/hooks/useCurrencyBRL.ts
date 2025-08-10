export function useCurrencyBRL(): (value: number, modifier?: number) => string {
  const fmt = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  });
  return (value: number, modifier?: number) => {
    if (modifier) {
      return fmt.format(value * modifier);
    }
    return fmt.format(value);
  };
}
