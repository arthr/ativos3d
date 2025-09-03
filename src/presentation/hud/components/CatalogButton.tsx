import { type JSX, useEffect, useState, useMemo } from "react";
import type { CatalogButtonProps } from "@core/types/ui/HudTypes";
import { cn } from "@shared/utils/classNames";

function useResolvableImage(src?: string | null) {
    const [validSrc, setValidSrc] = useState<string | null>(null);

    const isHttpUrl = useMemo(() => !!src && /^https?:\/\//i.test(src), [src]);

    useEffect(() => {
        let cancelled = false;

        if (!src) {
            setValidSrc(null);
            return;
        }

        if (isHttpUrl) {
            const img = new window.Image();
            img.onload = (): boolean | void => !cancelled && setValidSrc(src);
            img.onerror = (): boolean | void => !cancelled && setValidSrc(null);
            img.src = src;
            return (): void => {
                cancelled = true;
            };
        }

        window
            .fetch(src, { method: "HEAD" })
            .then((response) => !cancelled && setValidSrc(response.ok ? src : null))
            .catch(() => !cancelled && setValidSrc(null));

        return (): void => {
            cancelled = true;
        };
    }, [isHttpUrl, src]);

    return validSrc;
}

/**
 * Botão para selecionar itens do catálogo
 * Exibe ícone, label, preço e estado enabled/disabled
 */
export function CatalogButton({ item, isActive, onSelect }: CatalogButtonProps): JSX.Element {
    const { Icon, label, price, enabled, image } = item;

    const imageSrc = useResolvableImage(image ?? null);

    function handleClick(): void {
        if (enabled) {
            onSelect();
        }
    }

    return (
        <button
            aria-label={`${label} - R$ ${price}`}
            aria-pressed={isActive}
            disabled={!enabled}
            onClick={handleClick}
            className={cn(
                "group inline-flex flex-col items-center gap-1 rounded-xl select-none overflow-hidden",
                "transition-all min-w-[80px]",
                !enabled && "opacity-50 cursor-not-allowed",
                enabled && isActive
                    ? "bg-emerald-500/90 text-white shadow-inner"
                    : "bg-white/80 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-100",
                enabled && !isActive && "hover:bg-white dark:hover:bg-neutral-800",
            )}
        >
            <div
                className={cn(
                    "grid place-items-center h-16 w-24",
                    "overflow-hidden",
                    enabled && isActive
                        ? "ring-white/40 bg-white/10"
                        : "ring-black/10 dark:ring-white/10 bg-black/5 dark:bg-white/5",
                )}
            >
                {imageSrc && (
                    <img
                        src={imageSrc}
                        alt={label}
                        className="size-24 object-center object-fill rounded-b-md"
                    />
                )}
                <Icon className="text-lg" />
            </div>

            <div className="flex flex-col items-center gap-0.5 pb-1">
                <span className="text-[11px] leading-none font-medium">{label}</span>
                {price > 0 && (
                    <span
                        className={cn(
                            "text-[10px] leading-none",
                            enabled && isActive
                                ? "text-white/80"
                                : "text-emerald-600 dark:text-emerald-400",
                        )}
                    >
                        R$ {price}
                    </span>
                )}
            </div>
        </button>
    );
}
