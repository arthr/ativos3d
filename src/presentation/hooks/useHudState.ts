import { useState, useMemo } from "react";
import type { HudMode, HudSelection } from "@core/types/ui/HudTypes";

/**
 * Hook para gerenciar estado do HUD
 * Centraliza lógica de modo ativo e seleções por modo
 */
export function useHudState() {
    const [mode, setMode] = useState<HudMode>(null);
    const [selected, setSelected] = useState<HudSelection>({});

    /**
     * Alterna entre modos, fechando se já estiver ativo
     */
    function toggleMode(next: Exclude<HudMode, null>): void {
        setMode((prev) => (prev === next ? null : next));
    }

    /**
     * Seleciona uma opção dentro do modo atual
     */
    function selectOption(m: Exclude<HudMode, null>, key: string): void {
        setSelected((s) => ({ ...s, [m]: key }));
    }

    /**
     * Chave da opção selecionada no modo atual
     */
    const activeSelectedKey = useMemo(
        () => (mode ? (selected[mode] ?? null) : null),
        [mode, selected],
    );

    return {
        mode,
        selected,
        activeSelectedKey,
        toggleMode,
        selectOption,
    };
}
