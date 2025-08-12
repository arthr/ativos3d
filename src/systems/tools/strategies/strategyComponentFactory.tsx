import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ToolContext, ToolStrategy } from "./types";

export function strategyComponentFactory(create: (ctx: ToolContext) => ToolStrategy) {
  return function StrategyComponent({ ctx }: { ctx: ToolContext }) {
    const strategyRef = useRef<ToolStrategy | null>(null);
    const cleanupRef = useRef<(() => void) | undefined>(undefined);

    useEffect(() => {
      strategyRef.current = create(ctx);
      cleanupRef.current = strategyRef.current.onActivate?.() as (() => void) | undefined;
      return () => {
        if (typeof cleanupRef.current === "function") cleanupRef.current();
        strategyRef.current?.onDeactivate?.();
      };
    }, [ctx]);

    useFrame(() => {
      strategyRef.current?.onFrame?.();
    });

    return strategyRef.current?.renderPreview() ?? null;
  };
}

export default strategyComponentFactory;
