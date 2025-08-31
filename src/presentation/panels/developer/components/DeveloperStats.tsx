import { useRef, type RefObject } from "react";
import type { JSX } from "react";
import { Stats } from "@react-three/drei";

/**
 * DeveloperStats: wrapper para Drei <Stats/> dentro de um container controlado.
 * - Cria um nó DOM interno para ser o parent do Stats, garantindo isolamento visual.
 * - O Stats só é montado quando `show` for true.
 */
export function DeveloperStats({
    show,
    panel = 0,
    className = "relative w-[80px] h-[48px]",
    onCyclePanel,
}: {
    readonly show: boolean;
    /** 0=fps, 1=ms, 2=mb */
    readonly panel?: 0 | 1 | 2;
    readonly className?: string;

    /** Chamado quando o usuário clica no Stats (ciclo de painel). */
    readonly onCyclePanel?: () => void;
}): JSX.Element | null {
    const containerRef = useRef<HTMLDivElement | null>(null);
    if (!show) return null;

    return (
        <div ref={containerRef} className={className} onClick={onCyclePanel}>
            {/* Override de posicionamento: usa absolute no contexto do container */}
            <Stats
                showPanel={panel}
                parent={containerRef as RefObject<HTMLElement>}
                className="!relative !left-0 !top-0 !right-auto !bottom-auto"
            />
        </div>
    );
}
