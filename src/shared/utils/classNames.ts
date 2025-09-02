/**
 * Utilitário para concatenar classes CSS condicionalmente
 * Filtra valores falsy e junta as classes válidas
 *
 * @param xs - Array de strings de classe ou valores falsy
 * @returns String com classes concatenadas
 */
export function cn(...xs: Array<string | false | null | undefined>): string {
    return xs.filter(Boolean).join(" ");
}
