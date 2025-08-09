import { useEffect, useMemo, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useStore } from "../../store/useStore";
import { Tool } from "../../core/types";
import { ToolStrategy, ToolContext } from "./strategies/types";
// no direct event bus usage here

type StrategyFactory = (ctx: ToolContext) => ToolStrategy;

export function ToolManager({ strategies }: { strategies: Record<Tool, StrategyFactory> }) {
  const { camera, gl, scene } = useThree();
  const activeTool = useStore((s) => s.activeTool);
  const [current, setCurrent] = useState<ToolStrategy | null>(null);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);
  const ctx = useMemo<ToolContext>(() => ({ camera, gl, scene }), [camera, gl, scene]);

  useEffect(() => {
    // On tool change, deactivate previous and activate new
    if (cleanupRef.current) cleanupRef.current();
    current?.onDeactivate?.();
    const factory = strategies[activeTool];
    if (!factory) {
      setCurrent(null);
      return;
    }
    const instance = factory(ctx);
    const cleanup = instance.onActivate(ctx);
    cleanupRef.current = typeof cleanup === "function" ? cleanup : undefined;
    setCurrent(instance);
    return () => {
      if (cleanupRef.current) cleanupRef.current();
      instance.onDeactivate?.();
    };
  }, [activeTool, ctx, strategies]);

  useFrame(() => {
    current?.onFrame?.();
  });

  return current?.renderPreview() ?? null;
}
