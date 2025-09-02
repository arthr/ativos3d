import { useState, useMemo } from "react";
import type { HudMode, HudSelection, CatalogSelection } from "@core/types/ui/HudTypes";

/**
 * Hook para gerenciar estado do HUD
 * Centraliza lógica de modo ativo e seleções por modo
 */
export function useHudState(): {
    mode: HudMode;
    selected: HudSelection;
    activeSelectedKey: string | null;
    catalogSelected: CatalogSelection;
    shouldShowCatalog: boolean;
    toggleMode: (next: Exclude<HudMode, null>) => void;
    selectOption: (m: Exclude<HudMode, null>, key: string) => void;
    selectCatalogItem: (key: string) => void;
} {
    const [mode, setMode] = useState<HudMode>(null);
    const [selected, setSelected] = useState<HudSelection>({});
    const [catalogSelected, setCatalogSelected] = useState<CatalogSelection>(null);

    /**
     * Alterna entre modos, fechando se já estiver ativo
     * Limpa seleção de catálogo quando sai do modo buy
     */
    function toggleMode(next: Exclude<HudMode, null>): void {
        setMode((prev) => {
            const newMode = prev === next ? null : next;
            // Limpa seleção de catálogo se não estiver no modo buy
            if (newMode !== "buy") {
                setCatalogSelected(null);
            }
            return newMode;
        });
    }

    /**
     * Seleciona uma opção dentro do modo atual
     * Limpa seleção de catálogo se não estiver em buy > place
     */
    function selectOption(m: Exclude<HudMode, null>, key: string): void {
        setSelected((s) => ({ ...s, [m]: key }));

        // Limpa seleção de catálogo se não estiver em buy > place
        if (!(m === "buy" && key === "place")) {
            setCatalogSelected(null);
        }
    }

    /**
     * Seleciona um item do catálogo
     */
    function selectCatalogItem(key: string): void {
        setCatalogSelected(key);
    }

    /**
     * Chave da opção selecionada no modo atual
     */
    const activeSelectedKey = useMemo(
        () => (mode ? (selected[mode] ?? null) : null),
        [mode, selected],
    );

    /**
     * Verifica se o catálogo deve ser exibido (buy > place)
     */
    const shouldShowCatalog = useMemo(
        () => mode === "buy" && activeSelectedKey === "place",
        [mode, activeSelectedKey],
    );

    return {
        mode,
        selected,
        activeSelectedKey,
        catalogSelected,
        shouldShowCatalog,
        toggleMode,
        selectOption,
        selectCatalogItem,
    };
}
