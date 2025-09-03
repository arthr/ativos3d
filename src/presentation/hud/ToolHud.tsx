import { useEffect, useRef, type JSX } from "react";
import type { InputAction } from "@core/types/input";
import type { HudMode } from "@core/types/ui/HudTypes";
import { InputMapper } from "@infrastructure/input";
import { useApplication } from "@presentation/hooks/useApplication";
import { useHudState } from "../hooks/useHudState";
import { ModePanel, ToolPanel, CatalogPanel } from "./components";
import { CATALOG_ITEMS, MODE_OPTIONS } from "./constants/hudConstants";

/**
 * HUD principal com visual "game UI"
 * Gerencia modos (view/buy/build) e ferramentas disponíveis
 */
export function ToolHud(): JSX.Element {
    const { eventBus } = useApplication();
    const mapperRef = useRef<InputMapper>();
    const modeRef = useRef<HudMode>(null);
    const toggleRef = useRef<(m: Exclude<HudMode, null>) => void>();
    const selectRef = useRef<(m: Exclude<HudMode, null>, k: string) => void>();

    const {
        mode,
        activeSelectedKey,
        catalogSelected,
        shouldShowCatalog,
        toggleMode,
        selectOption,
        selectCatalogItem,
    } = useHudState();

    toggleRef.current = toggleMode;
    selectRef.current = selectOption;
    modeRef.current = mode;

    useEffect(() => {
        const mapper = new InputMapper({ eventBus });
        mapperRef.current = mapper;

        mapper.registerMapping({ key: "F1", action: "mode.view" });
        mapper.registerMapping({ key: "F2", action: "mode.buy" });
        mapper.registerMapping({ key: "F3", action: "mode.build" });

        (Object.entries(MODE_OPTIONS) as Array<[
            Exclude<HudMode, null>,
            typeof MODE_OPTIONS["view"],
        ]>).forEach(([m, options]) => {
            options.forEach((opt, index) => {
                mapper.registerMapping({
                    key: `Digit${index + 1}`,
                    action: `tool.${opt.key}` as InputAction,
                    context: m,
                });
            });
        });

        const off = eventBus.on("actionTriggered", ({ action }) => {
            if (action.startsWith("mode.")) {
                toggleRef.current?.(
                    action.split(".")[1] as Exclude<HudMode, null>,
                );
                return;
            }

            if (action.startsWith("tool.") && modeRef.current) {
                selectRef.current?.(
                    modeRef.current as Exclude<HudMode, null>,
                    action.split(".")[1],
                );
            }
        });

        return () => {
            mapper.dispose();
            off();
        };
    }, [eventBus]);

    useEffect(() => {
        mapperRef.current?.setContext(mode ?? undefined);
    }, [mode]);

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
