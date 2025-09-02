import type { JSX } from "react";
import { useHudState } from "../hooks/useHudState";
import { ModePanel, ToolPanel, CatalogPanel } from "./components";
import { CATALOG_ITEMS } from "./constants/hudConstants";

/**
 * HUD principal com visual "game UI"
 * Gerencia modos (view/buy/build) e ferramentas disponíveis
 */
export function ToolHud(): JSX.Element {
    const {
        mode,
        activeSelectedKey,
        catalogSelected,
        shouldShowCatalog,
        toggleMode,
        selectOption,
        selectCatalogItem,
    } = useHudState();

    function handleToolSelect(key: string): void {
        if (mode) {
            selectOption(mode, key);
        }
    }

    function handleCatalogSelect(key: string): void {
        selectCatalogItem(key);
    }

    return (
        <div
            className="
                pointer-events-none
                fixed bottom-4 left-0 translate-x-3
                flex items-end gap-3
                z-50
            "
            role="toolbar"
            aria-label="Ferramentas"
        >
            <ModePanel currentMode={mode} onModeToggle={toggleMode} />

            {mode && (
                <ToolPanel
                    mode={mode}
                    selectedKey={activeSelectedKey}
                    onToolSelect={handleToolSelect}
                />
            )}

            {shouldShowCatalog && (
                <CatalogPanel
                    items={CATALOG_ITEMS}
                    selectedKey={catalogSelected}
                    onCatalogSelect={handleCatalogSelect}
                />
            )}
        </div>
    );
}
